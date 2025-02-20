import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { onDrop } from '../../dnd/onDrop';
import { Items } from '../../store/items';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { isSlotWithItem } from '../../helpers';
import { setClipboard } from '../../utils/setClipboard';
import { Divider, Menu, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store';
import { openModal, setContextMenu } from '../../store/inventory';
import React from 'react';
import { NestedMenuItem } from 'mui-nested-menu';
import { onSplit } from '../../dnd/onSplit';

interface DataProps {
  action: string;
  component?: string;
  slot?: number;
  serial?: string;
  id?: number;
}

interface Button {
  label: string;
  index: number;
  group?: string;
}

interface Group {
  groupName: string | null;
  buttons: ButtonWithIndex[];
}

interface ButtonWithIndex extends Button {
  index: number;
}

interface GroupedButtons extends Array<Group> {}

const InventoryContext: React.FC = () => {
  const contextMenu = useAppSelector((state) => state.inventory.contextMenu);
  const item = contextMenu.item;
  const dispatch = useAppDispatch();

  const handleClick = (data: DataProps) => {
    if (!item) return;

    dispatch(setContextMenu({ coords: null }));

    switch (data && data.action) {
      case 'use':
        onUse({ name: item.name, slot: item.slot });
        break;
      case 'give':
        onGive({ name: item.name, slot: item.slot });
        break;
      case 'drop':
        isSlotWithItem(item) && onDrop({ item: item, inventory: 'player' });
        break;
      case 'remove':
        fetchNui('removeComponent', { component: data?.component, slot: data?.slot });
        break;
      case 'removeAmmo':
        fetchNui('removeAmmo', item.slot);
        break;
      case 'split':
        dispatch(openModal({ cb: (value?:number)=>{
          if(value!= null){
            isSlotWithItem(item) && onSplit({ item: item, inventory: 'player', amount: value });
          }
        }}))
        break;
      case 'copy':
        setClipboard(data.serial || '');
        break;
      case 'custom':
        fetchNui('useButton', { id: (data?.id || 0) + 1, slot: item.slot });
        break;
    }
  };

  const groupButtons = (buttons: any): GroupedButtons => {
    return buttons.reduce((groups: Group[], button: Button, index: number) => {
      if (button.group) {
        const groupIndex = groups.findIndex((group) => group.groupName === button.group);
        if (groupIndex !== -1) {
          groups[groupIndex].buttons.push({ ...button, index });
        } else {
          groups.push({
            groupName: button.group,
            buttons: [{ ...button, index }],
          });
        }
      } else {
        groups.push({
          groupName: null,
          buttons: [{ ...button, index }],
        });
      }
      return groups;
    }, []);
  }

  return (
    <>
      <Menu
        autoFocus={false}
        disableAutoFocusItem
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
        open={contextMenu.coords !== null}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu.coords !== null ? { top: contextMenu.coords.mouseY, left: contextMenu.coords.mouseX } : undefined
        }
        onClose={() => dispatch(setContextMenu({ coords: null }))}
      >
        <MenuItem onClick={() => handleClick({ action: 'use' })}>{Locale.ui_use || 'Use'}</MenuItem>
        <MenuItem onClick={() => handleClick({ action: 'give' })}>{Locale.ui_give || 'Give'}</MenuItem>
        <MenuItem onClick={() => handleClick({ action: 'drop' })}>{Locale.ui_drop || 'Drop'}</MenuItem>
        {item && item.count && item.count > 1 && (
          <MenuItem onClick={() => handleClick({ action: 'split' })}>{Locale.ui_split || 'Dividir'}</MenuItem>
        )}
        {item && item.metadata?.serial && <Divider />}
        {item && item.metadata?.ammo > 0 && (
          <MenuItem onClick={() => handleClick({ action: 'removeAmmo' })}>{Locale.ui_remove_ammo}</MenuItem>
        )}
        {item && item.metadata?.serial && (
          <MenuItem onClick={() => handleClick({ action: 'copy', serial: item.metadata?.serial })}>
            {Locale.ui_copy}
          </MenuItem>
        )}
        {item && item.metadata?.components && item.metadata?.components.length > 0 && <Divider />}
        {item && item.metadata?.components && item.metadata?.components.length > 0 && (
          <NestedMenuItem parentMenuOpen={!!contextMenu} label={Locale.ui_removeattachments}>
            {item &&
              item.metadata?.components.map((component: string, index: number) => (
                <MenuItem key={index} onClick={() => handleClick({ action: 'remove', component, slot: item.slot })}>
                  {Items[component]?.label}
                </MenuItem>
              ))}
          </NestedMenuItem>
        )}
        {((item && item.name && Items[item.name]?.buttons?.length) || 0) > 0 && <Divider />}
        {((item && item.name && Items[item.name]?.buttons?.length) || 0) > 0 && (
          <>
            {item &&
              item.name &&
              groupButtons(Items[item.name]?.buttons).map((group: Group, index: number) => (
                <div key={index}>
                  {group.groupName ? (
                    <NestedMenuItem parentMenuOpen={!!contextMenu} label={group.groupName}>
                      {group.buttons.map((button: Button) => (
                        <MenuItem key={button.index} onClick={() => handleClick({ action: 'custom', id: button.index })}>
                          {button.label}
                        </MenuItem>
                      ))}
                    </NestedMenuItem>
                  ) : (
                    group.buttons.map((button: Button) => (
                      <MenuItem key={button.index} onClick={() => handleClick({ action: 'custom', id: button.index })}>
                        {button.label}
                      </MenuItem>
                    ))
                  )}
                </div>
              ))}
          </>
        )}
      </Menu>
    </>
  );
};

export default InventoryContext;
