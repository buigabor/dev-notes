/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Project } from '../state/reducers/projectsReducer';
import { CellListItem } from './CellListItem';
import { DeleteCellsDialog } from './DeleteCellsDialog';
import { AddProjectLayout } from './Layouts/AddProjectLayout';
import { EditProjectLayout } from './Layouts/EditProjectLayout';
import { LoadProjectLayout } from './Layouts/LoadProjectLayout';
import { ProjectActions } from './ProjectActions';
import { RoomService } from './RoomService';
import cellListStyles from './styles/cellListStyles';
import { AddCell } from './Utils/AddCell';
import { Alert } from './Utils/Alert';

export const CellList: React.FC = () => {
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showLoadOverlay, setShowLoadOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const orderedCellList = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((cellId: string) => {
      return data[cellId];
    });
  });

  const renderedCells = orderedCellList.map((cell) => (
    <React.Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell nextCellId={cell.id} />
    </React.Fragment>
  ));
  return (
    <>
      <DeleteCellsDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
      <Alert />
      <AddProjectLayout
        setShowAddOverlay={setShowAddOverlay}
        showAddOverlay={showAddOverlay}
      />
      <LoadProjectLayout
        projects={projects}
        showLoadOverlay={showLoadOverlay}
        setShowLoadOverlay={setShowLoadOverlay}
      />
      <EditProjectLayout
        showEditOverlay={showEditOverlay}
        setShowEditOverlay={setShowEditOverlay}
      />
      <ProjectActions
        setShowLoadOverlay={setShowLoadOverlay}
        setShowAddOverlay={setShowAddOverlay}
        setShowEditOverlay={setShowEditOverlay}
        setProjects={setProjects}
        setOpenDialog={setOpenDialog}
      />

      <div css={cellListStyles}>
        <AddCell
          forceVisible={orderedCellList.length === 0}
          nextCellId={null}
        />
        {renderedCells}
        <RoomService />
      </div>
    </>
  );
};
