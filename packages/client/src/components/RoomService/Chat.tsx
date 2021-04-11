/** @jsxImportSource @emotion/react */
import {
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  Search,
  Status
} from '@chatscope/chat-ui-kit-react';
import dateFormat from 'dateformat';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import baseURL from '../../server';
import { IReactRouterParams, match } from './RoomServiceHome';
import chatStyles from './styles/chatStyles';

export interface IMessage {
  text: string;
  sender: string;
  date: Date;
  direction: 'outgoing' | 'incoming';
  seen: 'seen' | 'not seen';
}

interface ChatProps {
  match: match<IReactRouterParams>;
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  showChat: boolean;
  mute: boolean;
  setMute: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Chat: React.FC<ChatProps> = ({
  match,
  setMessages,
  messages,
  showChat,
  setShowChat,
  mute,
  setMute,
}) => {
  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >();
  const [users, setUsers] = useState<string[]>([]);
  const [messagesToShow, setMessagesToShow] = useState<IMessage[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const user = useTypedSelector((state) => state.user);

  useEffect(() => {
    if (user.username) {
      const newSocket = io(`${baseURL}`, {
        query: { id: match.params?.id, user: String(user.userId) },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [match.params?.id, user.username, user.userId]);

  // SOCKET IO USEEFFECT
  useEffect(() => {
    if (socket == null) return;

    socket?.on('users-in-room', (users) => {
      setUsers([...users]);
    });

    socket?.on('user-disconnected', (userDisconnected) => {
      setUsers(users.filter((u) => u !== userDisconnected));
    });

    socket?.on('receive-message-me', (message) => {
      setMessages([
        ...messages,
        {
          ...message,
          direction: 'outgoing',
          status: 'available',
          seen: 'seen',
        },
      ]);
      setMessagesToShow([
        ...messagesToShow,
        {
          ...message,
          direction: 'outgoing',
          status: 'available',
          seen: 'seen',
        },
      ]);
    });
    socket?.on('receive-message', (message) => {
      if (showChat) {
        setMessages([
          ...messages,
          {
            ...message,
            direction: 'incoming',
            status: 'available',
            seen: 'seen',
          },
        ]);
        setMessagesToShow([
          ...messagesToShow,
          {
            ...message,
            direction: 'incoming',
            status: 'available',
            seen: 'seen',
          },
        ]);
      } else if (!showChat) {
        setMessages([
          ...messages,
          {
            ...message,
            direction: 'incoming',
            status: 'available',
            seen: 'not seen',
          },
        ]);
        setMessagesToShow([
          ...messagesToShow,
          {
            ...message,
            direction: 'incoming',
            status: 'available',
            seen: 'not seen',
          },
        ]);
      }
    });

    return () => {
      socket?.off('receive-message-me');
      socket?.off('receive-message');
      socket?.off('user-joined');
      socket?.off('user-disconnected');
    };
  }, [messages, messagesToShow, setMessages, showChat, socket, users]);

  useEffect(() => {
    if (!searchValue) {
      return setMessagesToShow([...messages]);
    }
    const messagesThatIncludeSearchValue = messages.filter((message) => {
      return message.text.includes(searchValue);
    });

    setMessagesToShow([...messagesThatIncludeSearchValue]);
  }, [messages, searchValue]);

  const variants = {
    closed: { opacity: 0, y: '100px' },
    open: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      css={chatStyles}
      variants={variants}
      animate={showChat ? 'open' : 'closed'}
      transition={{ duration: 0.25 }}
      style={{ display: showChat ? 'inline-block' : 'none' }}
    >
      <div className="chat-header">
        <span>Team Chat</span>

        <i
          onClick={() => {
            setShowChat(false);
          }}
          className="fas fa-times"
        ></i>
      </div>
      <div className="chat-container">
        <div className="chat-sidebar">
          <ConversationList>
            {socket ? (
              users.map((username) => {
                return (
                  // <div key={username} className="chat-sidebar__users-online">
                  <React.Fragment key={username}>
                    <Status status="available" />
                    <Conversation name={username}></Conversation>
                  </React.Fragment>
                  // </div>
                );
              })
            ) : (
              <Conversation name={'empty'}></Conversation>
            )}
          </ConversationList>
        </div>
        <div className="chat-message-container">
          <MainContainer>
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Actions>
                  <Search
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(v: string) => setSearchValue(v)}
                    onClearClick={() => setSearchValue('')}
                  />
                  <span className="mute-btn">
                    {mute ? (
                      <i
                        onClick={() => {
                          setMute(!mute);
                        }}
                        className="fas fa-volume-mute"
                      ></i>
                    ) : (
                      <i
                        onClick={() => {
                          setMute(!mute);
                        }}
                        className="fas fa-volume-off"
                      ></i>
                    )}
                  </span>
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList>
                {messagesToShow.map((message) => {
                  return (
                    <Message
                      key={'message-id-' + new Date().getTime() + Math.random()}
                      model={{
                        message: message.text,
                        direction: message.direction,
                      }}
                    >
                      <Message.Header
                        sender={message.sender}
                        sentTime={message.date}
                      />
                    </Message>
                  );
                })}
              </MessageList>
              <MessageInput
                attachButton={false}
                onSend={(value: string) => {
                  socket?.emit('send-message', {
                    text: value,
                    sender: user.username,
                    date: dateFormat(new Date(), 'HH:MM'),
                  });
                }}
                placeholder="Type message here"
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </motion.div>
  );
};
