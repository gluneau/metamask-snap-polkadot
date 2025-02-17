import React, {useContext, useState} from "react";
import { Box, Button, Card, CardContent, CardHeader, Dialog, Grid, TextField } from '@material-ui/core';
import { stringToHex } from "@polkadot/util/string";
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@material-ui/core";
import {MetaMaskContext} from "../../context/metamask";

interface Props {
  address: string;
}

export const SignMessage: React.FC<Props> = ({address}) => {
  const [state] = useContext(MetaMaskContext);

  const [textFieldValue, setTextFieldValue] = useState<string>("");
  const [modalBody, setModalBody] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(event.target.value);
  };

  const onSubmit = async () => {
    if (!state.polkadotSnap.snap) return;
    if (textFieldValue) {
      const api = await state.polkadotSnap.snap.getMetamaskSnapApi();
      if (api && api.signPayloadRaw) {
        const messageAsHex = stringToHex(textFieldValue);

        const messageSignResponse = await api.signPayloadRaw({
          address: address,
          data: messageAsHex,
          type: "bytes"
        });
        setTextFieldValue("");
        setModalBody(messageSignResponse);
        setModalOpen(true);
      }
    }
  };

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader title="Sign custom message" />
      <CardContent>
        <Grid container>
          <TextField
            onChange={handleChange}
            value={textFieldValue}
            size="medium"
            fullWidth
            id="recipient"
            label="Message"
            variant="outlined"
          />
        </Grid>
        <Box m="0.5rem" />
        <Grid container justify="flex-end">
          <Button onClick={onSubmit} color="secondary" variant="contained" size="large">Sign</Button>
        </Grid>
      </CardContent>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Message signature"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
						This is signature of your message:<br />
            <Typography style={{ wordWrap: "break-word" }}>{modalBody}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary" autoFocus>
						OK
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};