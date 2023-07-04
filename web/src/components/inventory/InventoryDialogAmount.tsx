import { Button, Dialog, DialogActions, DialogTitle, TextField } from "@mui/material";
import React from "react";
import { store, useAppDispatch, useAppSelector } from "../../store";
import { openModal, setItemAmount } from "../../store/inventory";
import { Locale } from "../../store/locale";

const InventoryDialogAmount: React.FC = () => {
    const modalInput = useAppSelector((state) => state.inventory.modalInput);
    const dispatch = useAppDispatch();

    let amount = 1;


    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber % 1 !== 0 || isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0)
          event.target.valueAsNumber = 0;
          amount=event.target.valueAsNumber;
      };
      
    const handleClose = () => {
        dispatch(openModal({ cb: null }));
        if(modalInput.cb != null){
            modalInput.cb(amount);
        }
    };
    

    return (
        <>
            <Dialog
                open={modalInput.cb != null}
                onClose={() => dispatch(openModal({ cb: null }))}
            >
                <DialogTitle>{Locale.ui_amount || 'Cantidad'}</DialogTitle>
                <TextField type="number" autoFocus defaultValue="1" onChange={inputHandler} />
                <DialogActions>
                    <Button onClick={handleClose}>{Locale.ui_cancel || 'Cancelar'}</Button>
                    <Button onClick={handleClose}>{Locale.ui_confirm || 'Confirmar'}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default InventoryDialogAmount;