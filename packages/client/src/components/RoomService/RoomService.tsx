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
  Status,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { css } from '@emotion/react';
import { useMap } from '@roomservice/react';
import dateFormat from 'dateformat';
import { default as React, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { match } from 'react-router';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import useSound from 'use-sound';
import chatNotificationSound from '../../audio/chat-notification-sound.mp3';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Project } from '../../state/reducers/projectsReducer';
import { DeleteCellsDialog } from '../DeleteCellsDialog';
import { AddProjectLayout } from '../Layouts/AddProjectLayout';
import { EditProjectLayout } from '../Layouts/EditProjectLayout';
import { LoadProjectLayout } from '../Layouts/LoadProjectLayout';
import { ProjectActions } from '../ProjectActions';
import cellListStyles from '../styles/cellListStyles';
import { Alert } from '../Utils/Alert';
import { AddCellShared } from './AddCellShared';
import { CellListItemShared } from './CellListItemShared';
import { IReactRouterParams } from './RoomServiceHome';

const randomId = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substr(2, 7);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

const spinnerStyles = css`
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translateY(-50%);
  transform: translateX(-50%);
`;
const chatIcon = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #00b5ad;
  position: fixed;
  bottom: 25px;
  right: 25px;
  cursor: pointer;
  .chat-unread-count {
    position: absolute;
    right: 12px;
    top: 10px;
    min-height: 20px;
    min-width: 15px;
    padding: 0.5px 3px;
    border-radius: 20%;
    color: #fff;
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  i {
    color: #fff;
    font-size: 1.85em;
  }
`;

const chatStyles = css`
  position: fixed;
  right: 25px;
  bottom: 70px;
  height: 500px;
  width: 450px;

  .mute-btn {
    color: #00b5ad;
    margin-left: 1.6rem;
    font-size: 1.4em;
    cursor: pointer;
  }

  .chat-container {
    display: flex;
    height: 100%;
    box-shadow: rgba(0, 0, 0, 0.55) 0px 5px 15px;
    flex-grow: 1;
  }
  .chat-sidebar {
    background-color: #fff;
    border-bottom-left-radius: 8px;
    width: 30%;
    &__users-online {
      display: flex;
      align-items: center;
      gap: 10px;
      .cs-status__bullet {
        justify-self: flex-start;
        margin-left: 10px;
      }
    }
  }
  .chat-message-container {
    width: 100%;
    flex-grow: 1;
  }
  .chat-header {
    width: 100%;
    height: 2.85rem;
    background-color: #4ec9c3;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    i {
      margin-right: 15px;
      margin-left: auto;
      cursor: pointer;
    }

    span {
      margin-left: 25px;
      font-size: 1.5em;
      font-weight: 600;
      font-family: 'Architects Daughter';
    }
  }

  .cs-main-container {
    width: 100%;

    border-bottom-right-radius: 8px;
  }
  .cs-message--incoming .cs-message__sender-name {
    display: block;
  }
  .cs-message--incoming .cs-message__sent-time {
    display: block;
  }
`;

interface IMessage {
  text: string;
  sender: string;
  date: Date;
  direction: 'outgoing' | 'incoming';
  seen: 'seen' | 'not seen';
}

interface RoomServiceProps {
  match: match<IReactRouterParams>;
}

export const RoomService: React.FC<RoomServiceProps> = ({ match }) => {
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showLoadOverlay, setShowLoadOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [openDeleteCellsDialog, setOpenDeleteCellsDialog] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messagesToShow, setMessagesToShow] = useState<IMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [playNotification] = useSound(chatNotificationSound);
  const [mute, setMute] = useState(false);

  const user = useTypedSelector((state) => state.user);

  useEffect(() => {
    if (showChat) {
      // Change unread messages to read
      const messagesRead = messages.map((message) => {
        message.seen = 'seen';
        return message;
      });
      setMessages([...messagesRead]);
      setUnreadMessagesCount(0);
    }
  }, [showChat]);

  useEffect(() => {
    const unreadMessages = messages.filter((m) => m.seen === 'not seen');
    if (unreadMessages.length > 0 && !mute) {
      playNotification();
    }
    setUnreadMessagesCount(unreadMessages.length);
  }, [messages]);

  // SOCKET.IO

  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >();

  useEffect(() => {
    if (user.username) {
      const newSocket = io('http://localhost:5000', {
        query: { id: match.params?.id, user: String(user.userId) },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [match.params?.id, user.username]);

  useEffect(() => {
    if (!searchValue) {
      return setMessagesToShow([...messages]);
    }
    const messagesThatIncludeSearchValue = messages.filter((message) => {
      return message.text.includes(searchValue);
    });

    setMessagesToShow([...messagesThatIncludeSearchValue]);
  }, [searchValue]);

  // ROOM SERVICE STATES
  // const [joined, joinedClient] = usePresence(match.params?.id, 'joined');
  const [data, dataMap] = useMap<{
    [key: string]: { id: string; type: string; content: string };
  }>(match.params?.id, 'mydata');

  const [orderCells, orderMap] = useMap<{ order: string[] }>(
    match.params?.id,
    'myorder',
  );

  useEffect(() => {
    orderMap?.set('order', []);
  }, [orderMap]);

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
      // const unreadMessages = messages.filter((m) => m.seen === 'not seen');
      // setUnreadMessagesCount(unreadMessages.length);
    });
    return () => {
      socket?.off('receive-message-me');
      socket?.off('receive-message');
      socket?.off('user-joined');
      socket?.off('user-disconnected');
    };
  }, [messages, messagesToShow, showChat, socket, users]);

  const insertAfterCell = (id: string | null, type: string) => {
    const cell = {
      id: randomId(),
      type,
      content: '',
    };
    dataMap?.set(cell.id, cell);

    const index = orderCells.order.findIndex((cellId) => cellId === id);
    if (index < 0) {
      orderCells.order.unshift(cell.id);
      const newOrder = [...orderCells.order];
      orderMap?.set('order', newOrder);
    } else {
      orderCells.order.splice(index + 1, 0, cell.id);
      const newOrder = [...orderCells.order];
      orderMap?.set('order', newOrder);
    }
  };

  const deleteCell = (id: string) => {
    const newOrder = orderCells.order.filter((cellId) => {
      return cellId !== id;
    });
    orderMap?.set('order', newOrder);
    dataMap?.delete(id);
  };

  const moveCell = (id: string, direction: 'up' | 'down') => {
    const index = orderCells.order.findIndex((cellId) => cellId === id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // if target index is out of bound
    if (targetIndex < 0 || targetIndex > orderCells.order.length - 1) {
      return;
    }

    // Swap the cells
    const newOrder = [...orderCells.order];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = id;
    orderMap?.set('order', newOrder);
  };

  let orderedCellList;
  if (orderCells.order) {
    orderedCellList = orderCells.order.map((cellId) => {
      return data[cellId];
    });
  }

  let renderedCells;
  if (orderedCellList) {
    renderedCells = orderedCellList.map((cell) => {
      if (!cell) {
        return 'emppty';
      }
      return (
        <React.Fragment key={cell.id}>
          <CellListItemShared
            moveCell={moveCell}
            deleteCell={deleteCell}
            data={data}
            dataMap={dataMap}
            cell={cell}
          />
          <AddCellShared
            insertAfterCell={insertAfterCell}
            nextCellId={cell.id}
          />
        </React.Fragment>
      );
    });
  }

  if (!dataMap || !orderMap || !orderCells || !data || !orderedCellList) {
    return (
      <div css={spinnerStyles}>
        <Loader
          type="Puff"
          color="#00b5ad"
          height={250}
          width={250}
          timeout={3000} //3 secs
        />
      </div>
    );
  }
  return (
    <>
      <DeleteCellsDialog
        data={data}
        orderMap={orderMap}
        dataMap={dataMap}
        collaboration={true}
        openDeleteCellsDialog={openDeleteCellsDialog}
        setOpenDeleteCellsDialog={setOpenDeleteCellsDialog}
      />
      <Alert />
      <AddProjectLayout
        data={data}
        orderCells={orderCells}
        collaboration={true}
        setShowAddOverlay={setShowAddOverlay}
        showAddOverlay={showAddOverlay}
      />
      <LoadProjectLayout
        collaboration={true}
        orderMap={orderMap}
        dataMap={dataMap}
        projects={projects}
        setProjects={setProjects}
        showLoadOverlay={showLoadOverlay}
        setShowLoadOverlay={setShowLoadOverlay}
      />
      <EditProjectLayout
        showEditOverlay={showEditOverlay}
        setShowEditOverlay={setShowEditOverlay}
      />
      <ProjectActions
        collaboration={true}
        setShowLoadOverlay={setShowLoadOverlay}
        setShowAddOverlay={setShowAddOverlay}
        setShowEditOverlay={setShowEditOverlay}
        setOpenDeleteCellsDialog={setOpenDeleteCellsDialog}
        setProjects={setProjects}
        data={data}
        orderCells={orderCells}
      />
      <div css={cellListStyles}>
        <AddCellShared
          insertAfterCell={insertAfterCell}
          forceVisible={orderedCellList.length === 0}
          nextCellId={null}
        />
        {renderedCells}
        <div
          onClick={() => {
            setShowChat(true);
          }}
          style={{ visibility: showChat ? 'hidden' : 'visible' }}
          css={chatIcon}
        >
          <span
            className="chat-unread-count"
            style={{
              visibility: unreadMessagesCount === 0 ? 'hidden' : 'visible',
            }}
          >
            {unreadMessagesCount}
          </span>
          <i className="fas fa-comment-alt"></i>
        </div>
        <div
          css={chatStyles}
          style={{ visibility: showChat ? 'visible' : 'hidden' }}
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
                {users.map((username) => {
                  return (
                    <div key={username} className="chat-sidebar__users-online">
                      <Status status="available" />
                      <Conversation name={username}></Conversation>
                    </div>
                  );
                })}
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
                          key={
                            'message-id-' + new Date().getTime() + Math.random()
                          }
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
        </div>
      </div>
    </>
  );
};
