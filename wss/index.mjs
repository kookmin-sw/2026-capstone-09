import 'dotenv/config';
import { createServer } from 'http';
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as syncProtocol from 'y-protocols/sync';
import * as decoding from 'lib0/decoding';
import * as encoding from 'lib0/encoding';
import { WebSocketServer } from 'ws';

const PORT = parseInt(process.env.PORT ?? '1234', 10);
const HOST = process.env.HOST ?? 'http://localhost';

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

// 룸 이름 → { doc: Y.Doc, awareness: Awareness, conns: Set<WebSocket> }
const rooms = new Map();

function getOrCreateRoom(roomName) {
  if (rooms.has(roomName)) return rooms.get(roomName);

  const doc = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(doc);
  const conns = new Set();

  // 문서 업데이트를 같은 룸의 모든 클라이언트에 브로드캐스트
  doc.on('update', (update) => {
    const msg = encoding.createEncoder();
    encoding.writeVarUint(msg, MESSAGE_SYNC);
    syncProtocol.writeUpdate(msg, update);
    const buf = encoding.toUint8Array(msg);
    conns.forEach((conn) => conn.readyState === 1 && conn.send(buf));
  });

  // awareness 변경을 브로드캐스트
  awareness.on('update', ({ added, updated, removed }) => {
    const changed = [...added, ...updated, ...removed];
    const msg = encoding.createEncoder();
    encoding.writeVarUint(msg, MESSAGE_AWARENESS);
    encoding.writeVarUint8Array(msg, awarenessProtocol.encodeAwarenessUpdate(awareness, changed));
    const buf = encoding.toUint8Array(msg);
    conns.forEach((conn) => conn.readyState === 1 && conn.send(buf));
  });

  const room = { doc, awareness, conns };
  rooms.set(roomName, room);
  return room;
}

function setupConnection(ws, roomName) {
  const { doc, awareness, conns } = getOrCreateRoom(roomName);
  conns.add(ws);

  ws.binaryType = 'arraybuffer';

  // Sync Step 1: 현재 상태 벡터 전송
  const syncMsg = encoding.createEncoder();
  encoding.writeVarUint(syncMsg, MESSAGE_SYNC);
  syncProtocol.writeSyncStep1(syncMsg, doc);
  ws.send(encoding.toUint8Array(syncMsg));

  // 현재 awareness 상태 전송
  const states = awareness.getStates();
  if (states.size > 0) {
    const awarenessMsg = encoding.createEncoder();
    encoding.writeVarUint(awarenessMsg, MESSAGE_AWARENESS);
    encoding.writeVarUint8Array(
      awarenessMsg,
      awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(states.keys())),
    );
    ws.send(encoding.toUint8Array(awarenessMsg));
  }

  ws.on('message', (data) => {
    const decoder = decoding.createDecoder(new Uint8Array(data));
    const msgType = decoding.readVarUint(decoder);

    if (msgType === MESSAGE_SYNC) {
      const reply = encoding.createEncoder();
      encoding.writeVarUint(reply, MESSAGE_SYNC);
      syncProtocol.readSyncMessage(decoder, reply, doc, null);
      if (encoding.length(reply) > 1) ws.send(encoding.toUint8Array(reply));
    } else if (msgType === MESSAGE_AWARENESS) {
      awarenessProtocol.applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), ws);
    }
  });

  ws.on('close', () => {
    conns.delete(ws);
    awarenessProtocol.removeAwarenessStates(awareness, [doc.clientID], null);
    // 연결이 없으면 룸 정리
    if (conns.size === 0) rooms.delete(roomName);
  });
}

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  // 쿼리스트링 제거 후 룸 이름 추출 (예: /node-42?token=... → "node-42")
  const url = new URL(req.url ?? '/', HOST);
  const roomName = url.pathname.slice(1) || 'default';
  setupConnection(ws, roomName);
});

server.listen(PORT, () => {
  const wsUrl = HOST.replace(/^http/, 'ws');
  console.log(`Yjs 서버 실행 중: ${wsUrl}:${PORT}`);
});
