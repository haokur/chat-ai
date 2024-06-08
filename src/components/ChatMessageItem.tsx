import './ChatMessageItem.scss';

import ReactMarkdown from 'react-markdown';

import iconChatAi from '../assets/icon-chatai.png';

const ChatMessageItem: React.FC<{ config: IMessageItem }> = ({ config }) => {
  const useName = config.role === 'user' ? 'You' : 'ChatGPT';

  return (
    <div className={`message message-${config.role}`}>
      <div className="message-avatar">
        {config.role === 'user' ? 'Y' : <img className="img" src={iconChatAi} alt="ChatGPT" />}
      </div>
      <div className="message-info">
        <h3 className="message-info__name">{useName}</h3>
        <div className="message-info__main">
          <ReactMarkdown>{config.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;
