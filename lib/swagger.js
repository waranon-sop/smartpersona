export const getApiDocs = () => {
  return {
    openapi: "3.0.0",
    info: {
      title: "SmartPersona API Documentation",
      version: "1.0.0",
      description:
        "Complete API documentation for the SmartPersona Resume Builder platform. Covers Authentication, User Management, Resume CRUD, Admin Operations, and Public endpoints.",
      contact: {
        name: "SmartPersona Support",
        email: "admin@smartpersona.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication — login, logout, token verification" },
      { name: "Users", description: "User registration, profile management, and account settings" },
      { name: "Resume", description: "Resume CRUD — save, load, delete, duplicate, publish" },
      { name: "Admin — Users", description: "Admin-only user management (list, create, update, delete)" },
      { name: "Admin — Resumes", description: "Admin-only resume management" },
      { name: "Admin — Dashboard", description: "Admin dashboard statistics" },
      { name: "Admin — Settings", description: "Platform settings management" },
      { name: "Admin — Export", description: "CSV data exports for admin" },
      { name: "Public", description: "Unauthenticated endpoints (public stats, settings, resume browsing)" },
      { name: "Upload", description: "File upload (profile pictures)" },
    ],

    // ─── Components ────────────────────────────────────────────
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored as an httpOnly cookie. Set automatically on login.",
        },
      },
      schemas: {
        // ── Shared Error ──
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error description" },
          },
        },
        // ── User ──
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 12 },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            profile_pic: { type: "string", nullable: true, example: "/uploads/profile_12_1776698811011.jpg" },
            role: { type: "string", enum: ["User", "Admin"], example: "User" },
            status: { type: "string", enum: ["Active", "Inactive", "Suspended"], example: "Active" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        UserWithResumes: {
          allOf: [
            { $ref: "#/components/schemas/User" },
            {
              type: "object",
              properties: {
                resumes: { type: "integer", description: "Number of resumes created", example: 3 },
              },
            },
          ],
        },
        // ── Pagination ──
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            totalItems: { type: "integer", example: 48 },
            totalPages: { type: "integer", example: 5 },
          },
        },
        // ── Resume (admin list view) ──
        ResumeListItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "d16f11da-6a7c-47aa-8a7e-3910893c89f8" },
            title: { type: "string", example: "John Doe Resume" },
            template: { type: "string", example: "classic" },
            status: { type: "string", enum: ["Draft", "Published", "Archived"], example: "Draft" },
            views: { type: "integer", example: 42 },
            downloads: { type: "integer", example: 5 },
            is_public: { type: "boolean" },
            public_key: { type: "string", nullable: true, example: "pub_a1b2c3d4" },
            created_at: { type: "string", format: "date-time" },
            user_name: { type: "string", example: "John Doe" },
            user_email: { type: "string", example: "john@example.com" },
          },
        },
        // ── Resume Content (full data) ──
        ResumeData: {
          type: "object",
          properties: {
            config: {
              type: "object",
              properties: {
                template: { type: "string", example: "classic" },
              },
            },
            personal: {
              type: "object",
              properties: {
                firstName: { type: "string" },
                lastName: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
                profilePic: { type: "string" },
                jobTitle: { type: "string" },
                linkedin: { type: "string" },
                github: { type: "string" },
                portfolio: { type: "string" },
                dateOfBirth: { type: "string" },
                nationality: { type: "string" },
              },
            },
            educations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  institution: { type: "string" },
                  degree: { type: "string" },
                  field: { type: "string" },
                  startYear: { type: "string" },
                  gradYear: { type: "string" },
                  gpa: { type: "string" },
                  location: { type: "string" },
                  activities: { type: "string" },
                },
              },
            },
            experiences: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  company: { type: "string" },
                  position: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  isCurrent: { type: "boolean" },
                  location: { type: "string" },
                  details: { type: "string" },
                },
              },
            },
            summary: {
              type: "object",
              properties: {
                details: { type: "string" },
              },
            },
            skills: {
              type: "object",
              properties: {
                list: { type: "string" },
              },
            },
            languages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  language: { type: "string" },
                  level: { type: "string", enum: ["Beginner", "Intermediate", "Professional", "Native"] },
                },
              },
            },
            certifications: { type: "array", items: { type: "object" } },
            projects: { type: "array", items: { type: "object" } },
          },
        },
        // ── Settings ──
        PlatformSettings: {
          type: "object",
          properties: {
            site_name: { type: "string", example: "SmartPersona" },
            contact_email: { type: "string", example: "admin@smartpersona.com" },
            allow_registration: { type: "string", enum: ["true", "false"], example: "true" },
            maintenance_mode: { type: "string", enum: ["true", "false"], example: "false" },
          },
        },
      },
    },

    // Default security — most endpoints require cookie auth
    security: [{ cookieAuth: [] }],

    // ─── Paths ─────────────────────────────────────────────────
    paths: {
      // ============================================================
      //  AUTH
      // ============================================================
      "/api/auth/login": {
        post: {
          summary: "Login",
          description: "Authenticate a user with username/email and password. On success, sets an httpOnly JWT cookie (`token`) valid for 1 hour.",
          tags: ["Auth"],
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username", "password"],
                  properties: {
                    username: { type: "string", description: "Username or email address", example: "admin" },
                    password: { type: "string", format: "password", example: "mypassword123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful — JWT cookie set",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Success" },
                      role: { type: "string", enum: ["User", "Admin"], example: "Admin" },
                    },
                  },
                },
              },
            },
            400: {
              description: "Missing username or password",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            403: {
              description: "Invalid password, account Inactive/Suspended",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            404: {
              description: "User not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            500: {
              description: "Server error",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },

      "/api/auth/logout": {
        post: {
          summary: "Logout",
          description: "Clear the authentication cookie and end the session.",
          tags: ["Auth"],
          responses: {
            200: {
              description: "Logout successful — cookie cleared",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Logged out" },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/api/auth/verify": {
        get: {
          summary: "Verify Token",
          description: "Verify the current JWT token from the httpOnly cookie. Returns user role and name if valid.",
          tags: ["Auth"],
          responses: {
            200: {
              description: "Token is valid",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Success" },
                      role: { type: "string", enum: ["User", "Admin"] },
                      name: { type: "string", example: "John Doe" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Token expired",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            403: {
              description: "No token or invalid token",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            404: {
              description: "User not found in database",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            500: {
              description: "Server error",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },

      // ============================================================
      //  USERS (self-service)
      // ============================================================
      "/api/users/register": {
        post: {
          summary: "Register New User",
          description: "Create a new user account. Registration may be disabled by admin via `allow_registration` setting. Default role is `User`.",
          tags: ["Users"],
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username", "email", "password"],
                  properties: {
                    username: { type: "string", minLength: 1, example: "johndoe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", minLength: 6, example: "secret123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Registration successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Success" },
                    },
                  },
                },
              },
            },
            400: {
              description: "Missing required fields or password too short (min 6 chars)",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            403: {
              description: "Registration is disabled by admin",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            409: {
              description: "Duplicate username or email",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            500: {
              description: "Server error",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },

      "/api/users/profile": {
        get: {
          summary: "Get Current User Profile",
          description: "Returns the authenticated user's profile information and associated email addresses.",
          tags: ["Users"],
          responses: {
            200: {
              description: "Profile data with emails",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          name: { type: "string" },
                          email: { type: "string" },
                          profile_pic: { type: "string", nullable: true },
                        },
                      },
                      emails: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            email: { type: "string" },
                            is_primary: { type: "boolean" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        patch: {
          summary: "Update Profile",
          description: "Update the authenticated user's display name and/or profile picture URL.",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string", example: "Jane Doe" },
                    profile_pic: { type: "string", nullable: true, example: "/uploads/profile_12_1776698811011.jpg" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Profile updated",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Profile updated successfully" } } } } },
            },
            400: { description: "Name is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          summary: "Delete Account",
          description: "Permanently delete the authenticated user's account and all associated data (resumes, emails). Profile picture is also removed from disk. Auth cookie is cleared.",
          tags: ["Users"],
          responses: {
            200: {
              description: "Account deleted",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Account deleted successfully" } } } } },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/users/change-password": {
        post: {
          summary: "Change Password",
          description: "Change the authenticated user's password. Requires the current password for verification.",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["currentPassword", "newPassword"],
                  properties: {
                    currentPassword: { type: "string", format: "password" },
                    newPassword: { type: "string", format: "password" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Password changed",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Password updated successfully" } } } } },
            },
            400: { description: "Missing current or new password", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized (not logged in)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Incorrect current password", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/users/emails": {
        patch: {
          summary: "Update Primary Email",
          description: "Update the authenticated user's primary email address. Also syncs the `user_emails` table.",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", format: "email", example: "newemail@example.com" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Email updated",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Email updated successfully" } } } } },
            },
            400: { description: "Email is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            409: { description: "Email already in use by another account", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ============================================================
      //  RESUME (user-facing)
      // ============================================================
      "/api/resume/save": {
        post: {
          summary: "Save / Update Resume",
          description: "Create a new resume or update an existing one. If `resumeId` is provided, updates the existing resume; otherwise creates a new one with a UUID. Returns the resume ID.",
          tags: ["Resume"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    resumeId: {
                      type: "string",
                      format: "uuid",
                      nullable: true,
                      description: "Existing resume ID for update. Omit or null for new resume.",
                    },
                    data: { $ref: "#/components/schemas/ResumeData" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Resume updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Saved" },
                      resumeId: { type: "string", format: "uuid" },
                    },
                  },
                },
              },
            },
            201: {
              description: "New resume created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Created" },
                      resumeId: { type: "string", format: "uuid" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Forbidden — user does not own this resume", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/resume/load": {
        get: {
          summary: "Load Resume",
          description: "Load a specific resume by ID. Only the owner can load their own resume. View count is NOT incremented when owner views their own resume.",
          tags: ["Resume"],
          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Resume ID to load",
            },
          ],
          responses: {
            200: {
              description: "Resume data loaded",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/ResumeData" },
                      resumeId: { type: "string", format: "uuid" },
                    },
                  },
                },
              },
            },
            400: { description: "Resume ID is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Resume not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/resume/delete": {
        delete: {
          summary: "Delete Resume",
          description: "Delete a resume owned by the current user. Associated `resume_content` is removed via CASCADE.",
          tags: ["Resume"],
          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Resume ID to delete",
            },
          ],
          responses: {
            200: {
              description: "Resume deleted",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Deleted successfully" } } } } },
            },
            400: { description: "ID is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/resume/duplicate": {
        post: {
          summary: "Duplicate Resume",
          description: "Create a copy of an existing resume. The new resume title is appended with `(Copy)` and status is set to `Draft`.",
          tags: ["Resume"],
          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID of the resume to duplicate",
            },
          ],
          responses: {
            201: {
              description: "Resume duplicated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Duplicated successfully" },
                      newId: { type: "string", format: "uuid" },
                    },
                  },
                },
              },
            },
            400: { description: "ID is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Source resume not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/resume/publish": {
        post: {
          summary: "Publish Resume",
          description: "Make a resume public. Only one resume per user can be public at a time — previous public resume is automatically unpublished. Generates a unique `public_key`.",
          tags: ["Resume"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId"],
                  properties: {
                    resumeId: { type: "string", format: "uuid" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Resume published",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Resume published successfully" },
                      publicKey: { type: "string", example: "pub_a1b2c3d4" },
                    },
                  },
                },
              },
            },
            400: { description: "Resume ID is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Resume not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          summary: "Unpublish Resume",
          description: "Revoke public access to a resume. Sets `is_public = 0` and clears `public_key`.",
          tags: ["Resume"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId"],
                  properties: {
                    resumeId: { type: "string", format: "uuid" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Resume unpublished",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Resume unpublished successfully" } } } } },
            },
            400: { description: "Resume ID is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Resume not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        get: {
          summary: "Check Publish Status",
          description: "Check whether a specific resume is currently public and retrieve its public key.",
          tags: ["Resume"],
          parameters: [
            {
              name: "resumeId",
              in: "query",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Resume ID to check",
            },
          ],
          responses: {
            200: {
              description: "Publish status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      isPublic: { type: "boolean" },
                      publicKey: { type: "string", nullable: true, example: "pub_a1b2c3d4" },
                    },
                  },
                },
              },
            },
            400: { description: "Resume ID is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Resume not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/resume/public": {
        get: {
          summary: "View Public Resume",
          description: "Load a public resume's data. Increments the view counter only if the viewer is NOT the resume owner.",
          tags: ["Public"],
          security: [],
          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Resume ID",
            },
          ],
          responses: {
            200: {
              description: "Public resume data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/ResumeData" },
                      resumeId: { type: "string", format: "uuid" },
                      title: { type: "string", example: "John Doe Resume" },
                    },
                  },
                },
              },
            },
            400: { description: "Resume ID is required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Resume not found or not public", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/resume/search-public": {
        get: {
          summary: "Search Public Resumes",
          description: "Search and filter public resumes with pagination. Can search by name, email, or skills. Can filter by template and job role.",
          tags: ["Public"],
          security: [],
          parameters: [
            { name: "query", in: "query", schema: { type: "string" }, description: "Search by first name, last name, email, or skills" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            { name: "limit", in: "query", schema: { type: "integer", default: 12, maximum: 50 }, description: "Results per page (max 50)" },
            { name: "template", in: "query", schema: { type: "string" }, description: "Filter by template name (e.g. classic, modern). Use 'all' for no filter." },
            { name: "role", in: "query", schema: { type: "string" }, description: "Filter by job title keyword. Use 'all' for no filter." },
          ],
          responses: {
            200: {
              description: "Paginated search results",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      total: { type: "integer", example: 24 },
                      page: { type: "integer", example: 1 },
                      limit: { type: "integer", example: 12 },
                      totalPages: { type: "integer", example: 2 },
                      results: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            resumeId: { type: "string", format: "uuid" },
                            title: { type: "string" },
                            template: { type: "string" },
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                            email: { type: "string" },
                            jobTitle: { type: "string" },
                            skills: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ============================================================
      //  UPLOAD
      // ============================================================
      "/api/upload": {
        post: {
          summary: "Upload Profile Picture",
          description: "Upload an image file as a profile picture. Accepts JPEG, PNG, WebP, GIF. Maximum file size 5 MB. Returns the public URL path.",
          tags: ["Upload"],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                      description: "Image file (jpg, png, webp, gif — max 5 MB)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "File uploaded successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      url: { type: "string", example: "/uploads/profile_12_1776698811011.jpg" },
                    },
                  },
                },
              },
            },
            400: { description: "No file, invalid file type, or exceeds 5 MB", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Upload failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ============================================================
      //  PUBLIC (no auth required)
      // ============================================================
      "/api/stats/public": {
        get: {
          summary: "Get Public Platform Statistics",
          description: "Returns the total number of registered users and resumes. No authentication required.",
          tags: ["Public"],
          security: [],
          responses: {
            200: {
              description: "Public platform statistics",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalUsers: { type: "integer", example: 150 },
                      totalResumes: { type: "integer", example: 420 },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error — returns zero values as fallback",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalUsers: { type: "integer", example: 0 },
                      totalResumes: { type: "integer", example: 0 },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/api/settings/public": {
        get: {
          summary: "Get Public Site Settings",
          description: "Retrieve the site name and description for public pages. No authentication required.",
          tags: ["Public"],
          security: [],
          responses: {
            200: {
              description: "Public settings",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      site_name: { type: "string", example: "SmartPersona" },
                      site_description: { type: "string", example: "AI Resume Generation Platform" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error — returns default values as fallback",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      site_name: { type: "string", example: "SmartPersona" },
                      site_description: { type: "string", example: "" },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ============================================================
      //  ADMIN — USERS
      // ============================================================
      "/api/admin/users": {
        get: {
          summary: "List All Users (Paginated)",
          description: "Returns a paginated, filterable list of all users with resume counts. Admin only.",
          tags: ["Admin — Users"],
          parameters: [
            { name: "search", in: "query", schema: { type: "string" }, description: "Search by name or email" },
            { name: "role", in: "query", schema: { type: "string", enum: ["Admin", "User", "All Roles"] }, description: "Filter by role" },
            { name: "status", in: "query", schema: { type: "string", enum: ["Active", "Inactive", "Suspended", "All Status"] }, description: "Filter by status" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
          ],
          responses: {
            200: {
              description: "Paginated list of users",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/UserWithResumes" },
                      },
                      pagination: { $ref: "#/components/schemas/Pagination" },
                    },
                  },
                },
              },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        post: {
          summary: "Create New User (Admin)",
          description: "Admin creates a new user with a default password (`SmartPersona123!`). The user should change their password on first login.",
          tags: ["Admin — Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email"],
                  properties: {
                    name: { type: "string", example: "New User" },
                    email: { type: "string", format: "email", example: "newuser@example.com" },
                    role: { type: "string", enum: ["Admin", "User"], default: "User" },
                    status: { type: "string", enum: ["Active", "Inactive", "Suspended"], default: "Active" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 42 },
                      message: { type: "string", example: "User created successfully" },
                    },
                  },
                },
              },
            },
            400: { description: "Missing/invalid fields (name, email, role, status)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/admin/users/{id}": {
        get: {
          summary: "Get User by ID",
          description: "Retrieve a single user's full data by their ID. Admin only.",
          tags: ["Admin — Users"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "User ID" },
          ],
          responses: {
            200: {
              description: "User data",
              content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        put: {
          summary: "Update User",
          description: "Update a user's name, email, role, and status. Admin only.",
          tags: ["Admin — Users"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "User ID" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Updated Name" },
                    email: { type: "string", format: "email", example: "updated@example.com" },
                    role: { type: "string", enum: ["Admin", "User"] },
                    status: { type: "string", enum: ["Active", "Inactive", "Suspended"] },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User updated",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "User updated successfully" } } } } },
            },
            400: { description: "Invalid email format", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        patch: {
          summary: "Update User Status",
          description: "Quick update of only the user's status (Active/Inactive/Suspended). Admin only.",
          tags: ["Admin — Users"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "User ID" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: { type: "string", enum: ["Active", "Inactive", "Suspended"] },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Status updated",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Status updated successfully" } } } } },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          summary: "Delete User",
          description: "Permanently delete a user and all associated data (CASCADE). Admin only.",
          tags: ["Admin — Users"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "User ID" },
          ],
          responses: {
            200: {
              description: "User deleted",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "User deleted successfully" } } } } },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ============================================================
      //  ADMIN — RESUMES
      // ============================================================
      "/api/admin/resumes": {
        get: {
          summary: "List All Resumes (Paginated)",
          description: "Returns a paginated, filterable list of all resumes with author info. Admin only.",
          tags: ["Admin — Resumes"],
          parameters: [
            { name: "search", in: "query", schema: { type: "string" }, description: "Search by title, author name, or resume ID" },
            { name: "template", in: "query", schema: { type: "string" }, description: "Filter by template name. Use 'All Templates' for no filter." },
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" },
          ],
          responses: {
            200: {
              description: "Paginated list of resumes",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/ResumeListItem" },
                      },
                      pagination: { $ref: "#/components/schemas/Pagination" },
                    },
                  },
                },
              },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/api/admin/resumes/{id}": {
        get: {
          summary: "Get Resume by ID",
          description: "Retrieve a single resume's full data with author info. Admin only.",
          tags: ["Admin — Resumes"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Resume ID (UUID)" },
          ],
          responses: {
            200: {
              description: "Resume data with author info",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ResumeListItem" } } },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Resume not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          summary: "Delete Resume (Admin)",
          description: "Permanently delete any resume by ID. Associated `resume_content` is removed via CASCADE. Admin only.",
          tags: ["Admin — Resumes"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Resume ID (UUID)" },
          ],
          responses: {
            200: {
              description: "Resume deleted",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Resume deleted successfully" } } } } },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Resume not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ============================================================
      //  ADMIN — DASHBOARD
      // ============================================================
      "/api/admin/stats": {
        get: {
          summary: "Get Dashboard Statistics",
          description: "Returns total users, total resumes, top template, resumes created today, and 4 most recent user registrations. Admin only. Response is cached for 5 seconds.",
          tags: ["Admin — Dashboard"],
          responses: {
            200: {
              description: "Dashboard statistics",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalUsers: { type: "integer", example: 150 },
                      totalResumes: { type: "integer", example: 420 },
                      topTemplate: { type: "string", example: "classic" },
                      resumesToday: { type: "integer", example: 8 },
                      recentUsers: {
                        type: "array",
                        maxItems: 4,
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer" },
                            name: { type: "string" },
                            email: { type: "string" },
                            status: { type: "string" },
                            created_at: { type: "string", format: "date-time" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ============================================================
      //  ADMIN — SETTINGS
      // ============================================================
      "/api/admin/settings": {
        get: {
          summary: "Get Platform Settings",
          description: "Retrieve all platform settings (site name, contact email, registration toggle, maintenance mode). Admin only.",
          tags: ["Admin — Settings"],
          responses: {
            200: {
              description: "Settings data",
              content: { "application/json": { schema: { $ref: "#/components/schemas/PlatformSettings" } } },
            },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        post: {
          summary: "Update Platform Settings",
          description: "Update platform settings using UPSERT logic (`ON DUPLICATE KEY UPDATE`). Boolean values are converted to string `\"true\"`/`\"false\"`. Admin only.",
          tags: ["Admin — Settings"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    platformName: { type: "string", description: "Site display name", example: "SmartPersona" },
                    supportEmail: { type: "string", format: "email", description: "Contact email", example: "support@smartpersona.com" },
                    allow_registration: { type: "string", description: "Enable/disable user registration", enum: ["true", "false"] },
                    maintenance_mode: { type: "string", description: "Enable/disable maintenance mode", enum: ["true", "false"] },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Settings updated",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Settings updated successfully" } } } } },
            },
            400: { description: "Invalid email format", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Forbidden — Admins only", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ============================================================
      //  ADMIN — EXPORT
      // ============================================================
      "/api/admin/export/users": {
        get: {
          summary: "Export Users to CSV",
          description: "Download all users as a CSV file (ID, Name, Email, Role, Status, Created At). Admin only.",
          tags: ["Admin — Export"],
          responses: {
            200: {
              description: "CSV file download",
              content: {
                "text/csv": {
                  schema: { type: "string", format: "binary" },
                },
              },
              headers: {
                "Content-Disposition": {
                  schema: { type: "string", example: 'attachment; filename="smartpersona_users.csv"' },
                },
              },
            },
            401: { description: "Unauthorized" },
            500: { description: "Export failed" },
          },
        },
      },
      "/api/admin/export/resumes": {
        get: {
          summary: "Export Resumes to CSV",
          description: "Download all resumes as a CSV file (ID, Title, Author, Template, Status, Views, Created At). Admin only.",
          tags: ["Admin — Export"],
          responses: {
            200: {
              description: "CSV file download",
              content: {
                "text/csv": {
                  schema: { type: "string", format: "binary" },
                },
              },
              headers: {
                "Content-Disposition": {
                  schema: { type: "string", example: 'attachment; filename="smartpersona_resumes.csv"' },
                },
              },
            },
            401: { description: "Unauthorized" },
            500: { description: "Export failed" },
          },
        },
      },
      "/api/admin/export-users": {
        get: {
          summary: "Export Users to CSV (Legacy)",
          description: "Legacy endpoint — Download all users as a CSV file. Admin only.",
          tags: ["Admin — Export"],
          responses: {
            200: {
              description: "CSV file download",
              content: {
                "text/csv": {
                  schema: { type: "string", format: "binary" },
                },
              },
              headers: {
                "Content-Disposition": {
                  schema: { type: "string", example: 'attachment; filename="smartpersona_users_export.csv"' },
                },
              },
            },
            403: { description: "Forbidden — Admins only" },
            500: { description: "Export failed" },
          },
        },
      },
      "/api/admin/export-resumes": {
        get: {
          summary: "Export Resumes to CSV (Legacy)",
          description: "Legacy endpoint — Download all resumes as a CSV file with author info. Admin only.",
          tags: ["Admin — Export"],
          responses: {
            200: {
              description: "CSV file download",
              content: {
                "text/csv": {
                  schema: { type: "string", format: "binary" },
                },
              },
              headers: {
                "Content-Disposition": {
                  schema: { type: "string", example: 'attachment; filename="smartpersona_resumes_export.csv"' },
                },
              },
            },
            403: { description: "Forbidden — Admins only" },
            500: { description: "Export failed" },
          },
        },
      },
    },
  };
};
