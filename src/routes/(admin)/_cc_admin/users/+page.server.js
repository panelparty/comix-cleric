// Better Auth admin imports - now using comixCleric auth namespace

import { consoleError } from '$lib/utils/debug.js';

// SvelteKit load function
export const load = async ({ locals }) => {
  if (locals?.comixCleric && locals?.isAdmin) {
    // Setup for data fetching
    let admin = [];
    let adminCount = 0;
    let users = [];
    let userCount = 0;
    let guests = [];
    let guestCount = 0;

    // Attempt to fetch data
    try {
      // Get all admin users using comixCleric auth namespace
      const adminUsersResponse = await locals.comixCleric.db.find("user", {
        populate: {
          avatar: true,
        },
        filter: {
          role: {
            _eq: "admin"
          }
        }
      });
      
      const resAdminCount = await locals.comixCleric.db.count("user", {
        filter: {
          role: {
            _eq: "admin"
          }
        }
      });

      admin = adminUsersResponse;
      adminCount = resAdminCount;
      

      // Get all non-admin users
      const regularUsersResponse = await locals.comixCleric.db.find("user", {
        populate: {
          avatar: true,
        },
        filter: {
          role: {
            _eq: "user"
          }
        }
      });

      const resUserCount = await locals.comixCleric.db.count("user", {
        filter: {
          role: {
            _eq: "user"
          }
        }
      });

      // Get all non-staff / non-admin
      users = regularUsersResponse;
      userCount = resUserCount;

      // Get all non-staff / non-admin
      const resGuests = await locals.comixCleric.db.find("guests", {
        populate: {
          avatar: true,
        },
      });

      guests = resGuests;

      // Get count of all unique non-staff / non-admin accounts
      const resGuestCount = await locals.comixCleric.db.count("guests");

      guestCount = resGuestCount;

    } catch (e) {
      consoleError("Failed to fetch users:", e);
    }

    // Return what we have
    return {
      admin,
      adminCount,
      users,
      userCount,
      guests,
      guestCount,
    };
  } else {
    return;
  }
};
