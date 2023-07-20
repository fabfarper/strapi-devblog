import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  BaseCheckbox,
  Typography,
  Link,
  GridItem,
} from "@strapi/design-system";
import {
  VisuallyHidden,
  Avatar,
  Flex,
  IconButton,
  Loader,
  Alert,
} from "@strapi/design-system";
import { Pencil, Trash, Plus } from "@strapi/icons";
import axios from "../utils/axiosInstance";
import ConfirmationDialog from "./ConfirmationDialog";
import BulkActions from "./BulkActions";
import { useIntl } from "react-intl";
import getTrad from "../utils/getTrad";

const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReposIds, setSelectedReposIds] = useState([]);
  const [alert, setAlert] = useState(undefined);
  const [deletingProject, setDeletingProject] = useState(undefined);
  const { formatMessage } = useIntl();

  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert(undefined);
    }, 5000);
  };

  const createProject = (repo) => {
    axios
      .post("/github-projects/project", repo)
      .then((response) => {
        setRepos(
          repos.map((item) =>
            item.id == repo.id
              ? {
                  ...item,
                  projectId: response.data.id,
                }
              : item
          )
        );
        showAlert({
          title: "Project created",
          message: `Successfully created project ${response.data.title}`,
          variant: "success",
        });
      })
      .catch((error) => {
        showAlert({
          title: "An error occurred",
          message: error.toString(),
          variant: "danger",
        });
      });
  };

  const createManyProjects = (reposToBecomeProjects) => {
    axios
      .post("/github-projects/projects", {
        repos: reposToBecomeProjects,
      })
      .then((response) => {
        setRepos(
          repos.map((repo) => {
            const relatedProjectJustCreated = response.data.find(
              (project) => project.repositoryId == repo.id
            );
            return !repo.projectId && relatedProjectJustCreated
              ? {
                  ...repo,
                  projectId: relatedProjectJustCreated,
                }
              : repo;
          })
        );
        showAlert({
          title: "Projects created",
          message: `${reposToBecomeProjects.length} projects created successfully`,
          variant: "success",
        });
      })
      .catch((error) => {
        showAlert({
          title: "An error occurred when creating projects",
          message: `${error.toString} - Error creating at least one of the ${reposToBecomeProjects.length} projects, please retry`,
          variant: "danger",
        });
      })
      .finally(() => {
        setSelectedReposIds([]);
      });
  };

  const deleteProject = (repo) => {
    const { projectId } = repo;
    axios
      .delete(`/github-projects/project/${projectId}`)
      .then((response) => {
        setRepos(
          repos.map((item) =>
            item.id == repo.id
              ? {
                  ...item,
                  projectId: null,
                }
              : item
          )
        );
        showAlert({
          title: "Project deleted",
          message: `Successfully deleted project ${response.data.title}`,
          variant: "success",
        });
      })
      .catch((error) => {
        showAlert({
          title: "An error occurred",
          message: `${error.toString} - Error deleting project, please check and retry`,
          variant: "danger",
        });
      });
  };

  const deleteManyProjects = (projectIds) => {
    axios
      .delete("/github-projects/projects", {
        params: {
          projectIds,
        },
      })
      .then((response) => {
        setRepos(
          repos.map((repo) => {
            const relatedProjectJustDeleted = response.data.find(
              (project) => project.repositoryId == repo.id
            );
            return repo.projectId && relatedProjectJustDeleted
              ? {
                  ...repo,
                  projectId: null,
                }
              : repo;
          })
        );
        showAlert({
          title: "Projects deleted",
          message: `${projectIds.length} projects deleted successfully`,
          variant: "success",
        });
      })
      .catch((error) => {
        showAlert({
          title: "An error occurred when deleting projects",
          message: `${error.toString} - Error deleting at least one of the ${projectIds.length} projects, please check and retry`,
          variant: "danger",
        });
      })
      .finally(() => {
        setSelectedReposIds([]);
      });
  };

  useEffect(() => {
    setLoading(true);
    // fetch data
    axios
      .get("/github-projects/repos")
      .then((response) => setRepos(response.data))
      .catch((error) =>
        showAlert({
          title: "Error fetching repositories",
          variant: "danger",
          message: error.toString(),
        })
      );
    setLoading(false);
  }, []);

  if (loading) return <Loader />;
  //console.log(repos);

  const allChecked = selectedReposIds.length === repos.length;
  const isIndeterminated = selectedReposIds.length > 0 && !allChecked; // some repos selected but not all

  return (
    <Box padding={8} background="neutral100">
      {alert && (
        <div style={{ position: "absolute", top: 0, left: "14%" }}>
          <Alert
            closeLabel="Close alert"
            title={alert.title}
            variant={alert.variant}
            onClose=""
            action=""
          >
            {alert.message}
          </Alert>
        </div>
      )}
      <BulkActions
        selectedRepos={selectedReposIds.map((repoId) =>
          repos.find((repo) => repo.id == repoId)
        )}
        bulkCreateAction={createManyProjects}
        bulkDeleteAction={deleteManyProjects}
      />
      <Table colCount={6} rowCount={repos.length} footer={undefined}>
        <Thead>
          <Tr>
            <Th action="">
              <BaseCheckbox
                name="all-entries"
                aria-label="Select all entries"
                value={allChecked}
                indeterminate={isIndeterminated}
                onValueChange={(value) =>
                  value
                    ? setSelectedReposIds(repos.map((repo) => repo.id))
                    : setSelectedReposIds([])
                }
              />
            </Th>
            <Th action="">
              <Typography variant="sigma">Id</Typography>
            </Th>
            <Th action="">
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad("repo.name"),
                  defaultMessage: "Name",
                })}
              </Typography>
            </Th>
            <Th action="">
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad("repo.description"),
                  defaultMessage: "Description",
                })}
              </Typography>
            </Th>
            <Th action="">
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad("repo.url"),
                  defaultMessage: "Url",
                })}
              </Typography>
            </Th>
            <Th action="">
              <VisuallyHidden>
                {formatMessage({
                  id: getTrad("repo.actions"),
                  defaultMessage: "Actions",
                })}
              </VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map((repo) => {
            // const { id, name, shortDescription, url, projectId } = repo;
            return (
              <Tr key={repo.id}>
                <Td>
                  <BaseCheckbox
                    name="allCheckBox"
                    aria-label={`Select ${repo.id}`}
                    value={
                      selectedReposIds && selectedReposIds.includes(repo.id)
                    }
                    onValueChange={(value) => {
                      const newSelectedRepos = value
                        ? [...selectedReposIds, repo.id]
                        : selectedReposIds.filter((item) => item !== repo.id);
                      setSelectedReposIds(newSelectedRepos);
                    }}
                  />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{repo.id}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{repo.name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {repo.shortDescription}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link href={repo.url} isExternal>
                      {repo.url}
                    </Link>
                  </Typography>
                </Td>
                <Td>
                  {repo.projectId ? (
                    <Flex>
                      <Link
                        to={`/content-manager/collectionType/plugin::github-projects.project/${repo.projectId}`}
                      >
                        <IconButton
                          onClick=""
                          label="Edit"
                          noBorder
                          icon={<Pencil />}
                        />
                      </Link>
                      <Box paddingLeft={1}>
                        <IconButton
                          onClick={() => setDeletingProject(repo)}
                          label="Delete"
                          noBorder
                          icon={<Trash />}
                        />
                      </Box>
                    </Flex>
                  ) : (
                    <IconButton
                      onClick={() => createProject(repo)}
                      label="Add"
                      noBorder
                      icon={<Plus />}
                    />
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {deletingProject && (
        <ConfirmationDialog
          visible={!!deletingProject}
          message="Are you sure to delete this project ?"
          onClose={() => setDeletingProject(undefined)}
          onConfirm={() => deleteProject(deletingProject)}
        />
      )}
    </Box>
  );
};

export default Repo;
