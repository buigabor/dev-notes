/** @jsxImportSource @emotion/react */
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { css } from '@emotion/react';
import { useMap, usePresence, useRoom } from '@roomservice/react';
import axios from 'axios';
import dateFormat from 'dateformat';
import { default as React, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { RouteComponentProps } from 'react-router';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
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

interface IReactRouterParams {
  id: string;
}

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
  i {
    color: #fff;
    font-size: 1.75em;
  }
`;

const chatStyles = css`
  position: absolute;
  right: 30px;
  bottom: 30px;
  height: 540px;
  width: 400px;
  border-radius: 10px;
  .cs-main-container {
    width: 100%;
  }
  .cs-message--incoming .cs-message__sender-name {
    display: block;
  }
  .cs-message--incoming .cs-message__sent-time {
    display: block;
  }
  .chat-header {
  }
`;

interface Message {
  text: string;
  sender: string;
  date: Date;
  direction: 'outgoing' | 'incoming';
}

export const RoomService: React.FC<RouteComponentProps<IReactRouterParams>> = ({
  match,
}) => {
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showLoadOverlay, setShowLoadOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [openDeleteCellsDialog, setOpenDeleteCellsDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({ userId: '', username: '' });
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('http://localhost:4005/user', {
        withCredentials: true,
      });
      const { userId, username } = res.data;
      setCurrentUser({ userId, username });
      // const userId = res.data;
    };
    fetchUser();
  }, []);

  // SOCKET.IO

  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >();

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      query: { id: match.params?.id },
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [match.params?.id]);

  console.log(messages);

  useEffect(() => {
    // if (socket == null) return;
    socket?.on('receive-message-me', (message) => {
      setMessages([...messages, { ...message, direction: 'outgoing' }]);
    });
    socket?.on('receive-message', (message) => {
      setMessages([...messages, { ...message, direction: 'incoming' }]);
    });
    return () => {
      socket?.off('receive-message-me');
      socket?.off('receive-message');
    };
  }, [messages, socket]);

  // ROOM SERVICE STATES
  const [joined, joinedClient] = usePresence('myroom', 'joined');
  const [data, dataMap] = useMap<{
    [key: string]: { id: string; type: string; content: string };
  }>(match.params?.id, 'mydata');

  const [orderCells, orderMap] = useMap<{ order: string[] }>(
    match.params?.id,
    'myorder',
  );
  useEffect(() => {
    orderMap?.set('order', []);
    return () => {};
  }, [orderMap]);

  useEffect(() => {
    joinedClient.set(true);
  }, []);

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
  const room = useRoom(match.params?.id);

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
        <div css={chatIcon}>
          <i className="fas fa-comment-alt"></i>
        </div>
        <div css={chatStyles}>
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messages.map((message) => {
                  return (
                    <Message
                      key={'message-id-' + new Date().getTime() + Math.random()}
                      model={{
                        message: message.text,
                        direction: message.direction,
                      }}
                    >
                      <Message.Header
                        className="chat-header"
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
                    sender: currentUser.username,
                    date: dateFormat(new Date(), 'HH:MM'),
                  });
                }}
                placeholder="Type message here"
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
};
