import { prisma } from "@/lib/prisma";

export const createTeam = async (param: {
  ownerId: string;
  name: string;
  slug: string;
}) => {
  const { ownerId, name, slug } = param;

  const team = await prisma.team.create({
    data: {
      ownerId,
      name,
      slug,
    },
  });

  await addTeamMember(team.id, ownerId, "owner");

  return team;
};

export const getTeam = async (key: { id: string } | { slug: string }) => {
  return await prisma.team.findUnique({
    where: key,
  });
};

export const addTeamMember = async (
  teamId: string,
  userId: string,
  role: string
) => {
  return await prisma.teamMember.create({
    data: {
      userId,
      teamId,
      role,
    },
  });
};

export const getTeams = async (userId: string) => {
  return await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
};

// export const getTenantMembers = async (slug: string) => {
//   return await prisma.tenantUser.findMany({
//     where: {
//       tenant: {
//         slug,
//       },
//     },
//     include: {
//       user: true,
//     },
//   });
// };

// export async function isTenantMember(userId: string, tenantId: string) {
//   return (await prisma.tenantUser.findFirstOrThrow({
//     where: {
//       userId,
//       tenantId,
//     },
//   }))
//     ? true
//     : false;
// }
