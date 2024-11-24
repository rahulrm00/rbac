import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardActions, FormControlLabel, Switch, Checkbox } from "@mui/material";
import { styled } from "@mui/system";
import { blueGrey } from '@mui/material/colors';
const SectionButton = styled(Button)(({ theme, active }) => ({
  fontWeight: active ? "bold" : "normal",
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#dc004e', 
    },
  },
});
const App = () => {
  const [activeSection, setActiveSection] = useState("userManagement");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", status: true });
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [newPermission, setNewPermission] = useState("");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedRoles = JSON.parse(localStorage.getItem("roles")) || [];
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];

    setUsers(storedUsers);
    setRoles(storedRoles);
    setPermissions(storedPermissions);
  }, []);
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
    if (roles.length > 0) {
      localStorage.setItem("roles", JSON.stringify(roles));
    }
    if (permissions.length > 0) {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
  }, [users, roles, permissions]);


  const handleAddUser = () => {
    const updatedUsers = [...users, { ...newUser, id: users.length + 1 }];
    setUsers(updatedUsers);
    setNewUser({ name: "", email: "", role: "", status: true });
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setNewUser(userToEdit);
  };

 
  const handleAddRole = () => {
    if (newRole.name) {
      const updatedRoles = [...roles, newRole];
      setRoles(updatedRoles);
      setNewRole({ name: "", permissions: [] });
    }
  };

  const handleDeleteRole = (name) => {
    const updatedRoles = roles.filter((role) => role.name !== name);
    setRoles(updatedRoles);
  };

  const handleEditRole = (name) => {
    const roleToEdit = roles.find((role) => role.name === name);
    setNewRole(roleToEdit);
  };

  
  const handleAddPermission = () => {
    if (newPermission && !permissions.includes(newPermission)) {
      const updatedPermissions = [...permissions, newPermission];
      setPermissions(updatedPermissions);
      setNewPermission("");
    }
  };

  const handleDeletePermission = (permission) => {
    const updatedPermissions = permissions.filter((perm) => perm !== permission);
    setPermissions(updatedPermissions);
  };
  return (
    <div>
    <ThemeProvider theme={theme}>
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" align="center"  fontFamily="Montserrat, sans-serif" fontWeight="600" gutterBottom>
        Role-Based Access Control (RBAC) Dashboard
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 4 }}>
        {["userManagement", "roleManagement", "permissionManagement"].map((section) => (
          <Grid item key={section}>
            <SectionButton 
              active={activeSection === section ? 1 : 0}
              onClick={() => setActiveSection(section)}
            >
              {section === "userManagement" && "User Management"}
              {section === "roleManagement" && "Role Management"}
              {section === "permissionManagement" && "Permission Management"}
            </SectionButton>
          </Grid>
        ))}
      </Grid>
      {activeSection === "userManagement" && (
        <Box >
          <Card sx={{ padding: 2, marginBottom: 4, backgroundColor:"#eees" }}>
            <Typography variant="h6"  gutterBottom>
              Add New User
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    {roles.map((role, index) => (
                      <MenuItem key={index} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newUser.status}
                      onChange={(e) => setNewUser({ ...newUser, status: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" backgroundColor='#146ef5' onClick={handleAddUser}>
                  Add User
                </Button>
              </Grid>
            </Grid>
          </Card>

          {users.map((user) => (
            <Card key={user.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography>
                  {user.name} ({user.email}) - Role: {user.role} - Status:{" "}
                  {user.status ? "Active" : "Inactive"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={() => handleEditUser(user.id)}>
                  Edit
                </Button>
                <Button color="error" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      {activeSection === "roleManagement" && (
        <Box>
          <Card sx={{ padding: 2, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New Role
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Role Name"
                  fullWidth
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Assign Permissions</Typography>
                {permissions.map((permission, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={newRole.permissions.includes(permission)}
                        onChange={(e) =>
                          setNewRole({
                            ...newRole,
                            permissions: e.target.checked
                              ? [...newRole.permissions, permission]
                              : newRole.permissions.filter((perm) => perm !== permission),
                          })
                        }
                      />
                    }
                    label={permission}
                  />
                ))}
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleAddRole}>
                  Add Role
                </Button>
              </Grid>
            </Grid>
          </Card>

          {roles.map((role) => (
            <Card key={role.name} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography>
                  {role.name} - Permissions: {role.permissions.join(", ")}
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={() => handleEditRole(role.name)}>
                  Edit
                </Button>
                <Button color="error" onClick={() => handleDeleteRole(role.name)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      {activeSection === "permissionManagement" && (
        <Box>
          <Card sx={{ padding: 2, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New Permission
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Permission Name"
                  fullWidth
                  value={newPermission}
                  onChange={(e) => setNewPermission(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleAddPermission}>
                  Add Permission
                </Button>
              </Grid>
            </Grid>
          </Card>

          {permissions.map((permission) => (
            <Card key={permission} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography>{permission}</Typography>
              </CardContent>
              <CardActions>
                <Button color="error" onClick={() => handleDeletePermission(permission)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
    </ThemeProvider>
</div>
  )
};

export default App;

