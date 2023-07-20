import React, { useState } from "react";
import { Box, Button, Dialog, Flex, Typography } from "@strapi/design-system";
import ConfirmationDialog from "./ConfirmationDialog";

const BulkActions = ({ selectedRepos, bulkCreateAction, bulkDeleteAction }) => {
  const reposWithoutProject = selectedRepos.filter((repo) => !repo.projectId);
  const reposWithProject = selectedRepos.filter((repo) => repo.projectId);
  const nbProjectsToGenerate = reposWithoutProject.length;
  const nbProjectsToDelete = reposWithProject.length;
  const projectIdsToDelete = reposWithProject.map((repo) => repo.projectId);
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <Box paddingBottom={4}>
      <Flex>
        {!selectedRepos.length && <Typography>No projects selected</Typography>}
        {selectedRepos.length > 0 && (
          <Typography>{`You have ${nbProjectsToGenerate} projects to generate and ${nbProjectsToDelete} to delete`}</Typography>
        )}
        {nbProjectsToGenerate > 0 && (
          <Box paddingLeft={2}>
            <Button
              size="S"
              variant="success-light"
              onClick={() => bulkCreateAction(reposWithoutProject)}
            >
              {`Create ${nbProjectsToGenerate} project(s)`}
            </Button>
          </Box>
        )}
        {nbProjectsToDelete > 0 && (
          <Box paddingLeft={2}>
            <Button
              size="S"
              variant="danger-light"
              onClick={() => setDialogVisible(true)}
            >
              {`Delete ${nbProjectsToDelete} project(s)`}
            </Button>
          </Box>
        )}
      </Flex>
      <ConfirmationDialog
        visible={dialogVisible}
        message="Are you sure to delete these projects ?"
        onClose={() => setDialogVisible(false)}
        onConfirm={() => {
          bulkDeleteAction(projectIdsToDelete);
          setDialogVisible(false);
        }}
      />
    </Box>
  );
};
export default BulkActions;
