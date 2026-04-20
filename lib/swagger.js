export const getApiDocs = () => {
  return {
    openapi: "3.0.0",
    info: {
      title: "SmartPersona API Documentation",
      version: "1.0.0",
      description: "API endpoints for the SmartPersona application.",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
    security: [{ cookieAuth: [] }],
    paths: {
      "/api/auth/login": {
        post: {
          summary: "Login",
          description: "Authenticate user and receive a cookie token.",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Successful login" },
            400: { description: "Missing credentials" },
            403: { description: "Invalid password or inactive account" },
            404: { description: "User not found" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          summary: "Logout",
          description: "Clear the authentication cookie.",
          tags: ["Auth"],
          responses: {
            200: { description: "Successful logout" },
          },
        },
      },
      "/api/auth/verify": {
        get: {
          summary: "Verify Token",
          description: "Verify if the user's token is valid.",
          tags: ["Auth"],
          responses: {
            200: { description: "Token is valid" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/users/register": {
        post: {
          summary: "Register",
          description: "Register a new user.",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered" },
            400: { description: "Invalid input" },
          },
        },
      },
      "/api/users/profile": {
        get: {
          summary: "Get User Profile",
          tags: ["Users"],
          responses: {
            200: { description: "Profile details" },
            401: { description: "Unauthorized" },
          },
        },
        patch: {
          summary: "Update User Profile",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    profile_pic: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Profile updated" },
            401: { description: "Unauthorized" },
          },
        },
        delete: {
          summary: "Delete Account",
          tags: ["Users"],
          responses: {
            200: { description: "Account deleted" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/users/change-password": {
        post: {
          summary: "Change Password",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    currentPassword: { type: "string" },
                    newPassword: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password changed successfully" },
            400: { description: "Missing fields" },
            403: { description: "Incorrect current password" },
          },
        },
      },
      "/api/resume/save": {
        post: {
          summary: "Save Resume",
          tags: ["Resume"],
          responses: {
            200: { description: "Resume saved successfully" },
          },
        },
      },
      "/api/resume/load": {
        get: {
          summary: "Load Resumes",
          tags: ["Resume"],
          responses: {
            200: { description: "List of user resumes" },
          },
        },
      },
      "/api/resume/delete": {
        post: {
          summary: "Delete Resume",
          tags: ["Resume"],
          responses: {
            200: { description: "Resume deleted" },
          },
        },
      },
      "/api/resume/publish": {
        post: {
          summary: "Publish Resume",
          tags: ["Resume"],
          responses: {
            200: { description: "Resume visibility updated" },
          },
        },
      },
      "/api/resume/duplicate": {
        post: {
          summary: "Duplicate Resume",
          tags: ["Resume"],
          responses: {
            200: { description: "Resume duplicated" },
          },
        },
      },
      "/api/resume/public": {
        get: {
          summary: "Get Public Resumes",
          tags: ["Resume"],
          responses: {
            200: { description: "List of public resumes" },
          },
        },
      },
      "/api/admin/users": {
        get: {
          summary: "Get All Users",
          tags: ["Admin"],
          responses: {
            200: { description: "List of users" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/api/admin/users/{id}": {
        put: {
          summary: "Update User",
          tags: ["Admin"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "User updated" },
          },
        },
        delete: {
          summary: "Delete User",
          tags: ["Admin"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "User deleted" },
          },
        },
      },
      "/api/admin/resumes": {
        get: {
          summary: "Get All Resumes",
          tags: ["Admin"],
          responses: {
            200: { description: "List of resumes" },
          },
        },
      },
      "/api/admin/resumes/{id}": {
        get: {
          summary: "Get Resume by ID",
          tags: ["Admin"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Resume details" },
            404: { description: "Not found" },
          },
        },
        delete: {
          summary: "Delete Resume (Admin)",
          tags: ["Admin"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Resume deleted" },
          },
        },
      },
      "/api/admin/stats": {
        get: {
          summary: "Get Admin Statistics",
          tags: ["Admin"],
          responses: {
            200: { description: "Admin stats" },
          },
        },
      },
      "/api/admin/settings": {
        get: {
          summary: "Get Site Settings",
          tags: ["Admin"],
          responses: {
            200: { description: "Site settings" },
          },
        },
        put: {
          summary: "Update Site Settings",
          tags: ["Admin"],
          responses: {
            200: { description: "Settings updated" },
          },
        },
      },
      "/api/settings/public": {
        get: {
          summary: "Get Public Site Settings",
          description: "Retrieve site name and description for public pages.",
          tags: ["Settings"],
          security: [],
          responses: {
            200: { 
              description: "Public settings",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      site_name: { type: "string" },
                      site_description: { type: "string" },
                    }
                  }
                }
              }
            },
          },
        },
      },
      "/api/upload": {
        post: {
          summary: "Upload File",
          tags: ["Upload"],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    file: { type: "string", format: "binary" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "File uploaded successfully" }
          }
        }
      },
      "/api/stats/public": {
        get: {
          summary: "Get Public Stats",
          description: "Get the total number of users and resumes in the system.",
          tags: ["Stats"],
          security: [],
          responses: {
            200: { 
              description: "Public platform statistics",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalUsers: { type: "integer" },
                      totalResumes: { type: "integer" },
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/resume/search-public": {
        get: {
          summary: "Search Public Resumes",
          tags: ["Resume"],
          security: [],
          parameters: [
            {
              name: "q",
              in: "query",
              schema: { type: "string" },
              description: "Search query"
            }
          ],
          responses: {
            200: { description: "Search results" }
          }
        }
      },
      "/api/users/emails": {
        patch: {
          summary: "Update Primary Email",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Email updated successfully" },
            401: { description: "Unauthorized" },
            409: { description: "Email already in use" },
          },
        },
      },
      "/api/admin/export/users": {
        get: {
          summary: "Export Users to CSV",
          tags: ["Admin"],
          responses: {
            200: { description: "CSV file" },
          },
        },
      },
      "/api/admin/export/resumes": {
        get: {
          summary: "Export Resumes to CSV",
          tags: ["Admin"],
          responses: {
            200: { description: "CSV file" },
          },
        },
      },
    },
  };
};
