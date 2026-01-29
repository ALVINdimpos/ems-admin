"use client";

import RegistrationForm from "@/components/forms/RegistrationForm";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterModal({ open, onClose }: Props) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Register Event"
      size="lg"
      backdropClassName="bg-black/60"
    >
      <RegistrationForm />
    </Modal>
  );
}
