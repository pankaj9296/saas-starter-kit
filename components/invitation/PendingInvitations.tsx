import { Error, LetterAvatar, Loading } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { Team } from '@prisma/client';
import useInvitations from 'hooks/useInvitations';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { TeamInvitation } from 'models/invitation';

const PendingInvitations = ({ team }: { team: Team }) => {
  const [selectedInvitation, setSelectedInvitation] =
    useState<TeamInvitation | null>(null);

  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false);

  const { isLoading, isError, invitations, mutateInvitation } = useInvitations({
    slug: team.slug,
    sentViaEmail: true,
  });

  const { t } = useTranslation('common');

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const deleteInvitation = async (invitation: TeamInvitation | null) => {
    if (!invitation) return;

    const sp = new URLSearchParams({ id: invitation.id });

    const response = await fetch(
      `/api/teams/${team.slug}/invitations?${sp.toString()}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
      }
    );

    const json = (await response.json()) as ApiResponse<unknown>;

    if (!response.ok) {
      toast.error(json.error.message);
      return;
    }

    mutateInvitation();
    toast.success(t('invitation-deleted'));
  };

  if (!invitations || !invitations.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <h2 className="text-xl font-medium leading-none tracking-tight">
          {t('pending-invitations')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('description-invitations')}
        </p>
      </div>
      <table className="text-sm table w-full border-b dark:border-base-200">
        <thead className="bg-base-200">
          <tr>
            <th>{t('email')}</th>
            <th>{t('role')}</th>
            <th>{t('expires-at')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((invitation) => {
            return (
              <tr key={invitation.id}>
                <td>
                  <div className="flex items-center justify-start space-x-2">
                    {invitation.email && (
                      <>
                        <LetterAvatar name={invitation.email} />
                        <span>{invitation.email}</span>
                      </>
                    )}
                  </div>
                </td>
                <td>{invitation.role}</td>
                <td>{new Date(invitation.expires).toDateString()}</td>
                <td>
                  <Button
                    size="sm"
                    color="error"
                    variant="outline"
                    onClick={() => {
                      setSelectedInvitation(invitation);
                      setConfirmationDialogVisible(true);
                    }}
                  >
                    {t('remove')}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ConfirmationDialog
        visible={confirmationDialogVisible}
        onCancel={() => setConfirmationDialogVisible(false)}
        onConfirm={() => deleteInvitation(selectedInvitation)}
        title={t('confirm-delete-member-invitation')}
      >
        {t('delete-member-invitation-warning', {
          email: selectedInvitation?.email,
        })}
      </ConfirmationDialog>
    </div>
  );
};

export default PendingInvitations;
