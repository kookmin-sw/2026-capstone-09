import { NODE_STATUS_INFO, NodeStatusType } from '../constants/nodeStatus';

// 라벨명만 가져오기
export const getNodeStatusLabel = (status: NodeStatusType): string => {
  return NODE_STATUS_INFO[status]?.label;
};

// 색상만 가져오기
export const getNodeStatusColor = (status: NodeStatusType): string => {
  return NODE_STATUS_INFO[status]?.color;
};

// 색상만 가져오기
export const getNodeStatusIcon = (status: NodeStatusType): React.ReactNode => {
  return NODE_STATUS_INFO[status]?.icon;
};

// 전체 정보 가져오기
export const getNodeStatusInfo = (status: NodeStatusType) => {
  return NODE_STATUS_INFO[status];
};
