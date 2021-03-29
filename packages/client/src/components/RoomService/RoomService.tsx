/** @jsxImportSource @emotion/react */
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useMap } from '@roomservice/react';
import { default as React, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { match } from 'react-router';
import useSound from 'use-sound';
import chatNotificationSound from '../../audio/chat-notification-sound.mp3';
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
import { Chat, IMessage } from './Chat';
import { IReactRouterParams } from './RoomServiceHome';
import chatIcon from './styles/chatIconStyles';
import spinnerStyles from './styles/spinnerStyles';

const randomId = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substr(2, 7);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

interface RoomServiceProps {
  match: match<IReactRouterParams>;
}

export const RoomService: React.FC<RoomServiceProps> = ({ match }) => {
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showLoadOverlay, setShowLoadOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [openDeleteCellsDialog, setOpenDeleteCellsDialog] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [playNotification] = useSound(chatNotificationSound);
  const [mute, setMute] = useState(false);

  const [data, dataMap] = useMap<{
    [key: string]: { id: string; type: string; content: string };
  }>(match.params?.id, 'mydata');

  const [orderCells, orderMap] = useMap<{ order: string[] }>(
    match.params?.id,
    'myorder',
  );

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
  }, [messages, mute]);

  // ROOM SERVICE STATES

  useEffect(() => {
    orderMap?.set('order', []);
  }, [orderMap]);

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
        <Chat
          setShowChat={setShowChat}
          showChat={showChat}
          match={match}
          setMessages={setMessages}
          messages={messages}
          mute={mute}
          setMute={setMute}
        />
      </div>
    </>
  );
};
