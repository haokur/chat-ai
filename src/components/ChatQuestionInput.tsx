import './ChatQuestionInput.scss';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Alert, TextField } from '@mui/material';
import { useCallback, useState } from 'react';

import { SearchInputStatus } from '../configs/const.config';

const ChatQuestionInput: React.FC<{
  onQuestion: (question: string) => void;
  onInputApiKey: () => void;
  status: number;
}> = ({ onQuestion, onInputApiKey, status }) => {
  const [question, setQuestion] = useState('');
  const [questionTipVisible, setquestionTipVisible] = useState(false);

  const handleQuestionChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(ev.target.value);
  }, []);

  const sendQuestion = () => {
    if (!question) {
      setquestionTipVisible(true);
      setTimeout(() => {
        setquestionTipVisible(false);
      }, 3000);
      return;
    }
    onQuestion(question);
    setQuestion('');
  };

  const [isComposing, setIsComposing] = useState(false);
  const handleCompositionStart = () => {
    setIsComposing(true);
  };
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };
  const handleInputEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (isComposing) {
        // 在中文输入模式下按下 Enter，不执行操作
        event.preventDefault();
      } else {
        sendQuestion();
        event.preventDefault();
      }
    }
  };

  const handleMaskClick = () => {
    onInputApiKey();
  };

  const isDisabled = !question.length || status !== SearchInputStatus.Active;

  return (
    <div className="input-wrap">
      {questionTipVisible && <Alert severity="error">请输入你的问题...</Alert>}

      {/* 遮罩点击弹出输入key的弹窗 */}
      {status === SearchInputStatus.Unavailable && (
        <div className="input-wrap__mask" onClick={handleMaskClick}></div>
      )}

      <div className="input-wrap__main">
        <TextField
          disabled={status !== SearchInputStatus.Active}
          autoComplete="off"
          placeholder="请输入你的问题"
          fullWidth
          value={question}
          onChange={handleQuestionChange}
          onKeyDown={handleInputEnter}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <button className="send-btn" disabled={isDisabled} onClick={sendQuestion}>
          <ArrowUpwardIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatQuestionInput;
