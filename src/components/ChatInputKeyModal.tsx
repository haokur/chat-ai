import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';

import { STORAGE_API_KEY } from '../configs/storage.config';

export interface IChatInputKeyModalMethods {
  openApiKeyInputModal: () => void;
}
interface IChatInputKeyModalProps {
  onUpdateApiKey: (apiKey: string) => void;
}
const ChatInputKeyModal = React.forwardRef<IChatInputKeyModalMethods, IChatInputKeyModalProps>(
  (props, ref) => {
    React.useImperativeHandle(ref, () => ({
      openApiKeyInputModal() {
        setInputModalVisible(true);
      },
    }));

    const [inputModalVisible, setInputModalVisible] = React.useState(false);
    const [apiKey, setApiKey] = React.useState('');

    const handleApiKeyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      setApiKey(ev.target.value);
    };

    const confirmApiKey = () => {
      if (!apiKey) return;
      localStorage.setItem(STORAGE_API_KEY, apiKey);
      handleCloseInputModal();
      props.onUpdateApiKey(apiKey);
      setApiKey('');
    };

    const handleCloseInputModal = () => {
      setInputModalVisible(false);
    };

    return (
      <React.Fragment>
        <Dialog open={inputModalVisible} onClose={handleCloseInputModal}>
          <DialogTitle>请输入apiKey</DialogTitle>
          <DialogContent>
            <DialogContentText>
              关于获取OpenRouter API key：可以自行注册openrouter（
              <a href="https://openrouter.ai/">https://openrouter.ai/</a>
              ），并使用里面提供的免费model “Mistral 7B Instruct”生成的apiKey
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label="apiKey"
              fullWidth
              variant="standard"
              value={apiKey}
              onChange={handleApiKeyChange}
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInputModal}>取消</Button>
            <Button onClick={confirmApiKey}>确认</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
);

export default ChatInputKeyModal;
