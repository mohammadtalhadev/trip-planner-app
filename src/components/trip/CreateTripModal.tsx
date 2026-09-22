import React from 'react';
import { Modal } from '../common/Modal';
import { CreateJourneyForm } from './CreateJourneyForm';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestination?: {
    city: string;
    country: string;
    lat?: number;
    lon?: number;
    coverImage?: string;
  };
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  initialDestination,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="5xl"
      hideHeader
      noPadding
    >
      <CreateJourneyForm
        onClose={onClose}
        initialDestination={initialDestination}
      />
    </Modal>
  );
};
