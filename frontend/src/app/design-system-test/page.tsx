'use client';

import { Button, Menu, MenuContent, MenuList, MenuTrigger } from '@wanteddev/wds';
import { IconAgent, IconAiReview, IconPlus } from '@wanteddev/wds-icon';
import { CustomMenuItem } from '@/components/commons/custom-menu/CustomMemuItem';

const Demo = () => {
  return (
    <>
      <Menu>
        <MenuTrigger>
          <Button>Click me</Button>
        </MenuTrigger>

        <MenuContent sx={{ width: '154px' }}>
          <MenuList>
            <CustomMenuItem value="item1" icon={<IconPlus />} onClick={() => console.log('test')}>
              Item 1
            </CustomMenuItem>
            <CustomMenuItem value="item2" icon={<IconAiReview />}>
              Item 2
            </CustomMenuItem>
            <CustomMenuItem value="item3" icon={<IconAgent />}>
              Item 3
            </CustomMenuItem>
          </MenuList>
        </MenuContent>
      </Menu>
    </>
  );
};

export default Demo;
