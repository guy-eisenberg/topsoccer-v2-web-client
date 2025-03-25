import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { Button } from "../../core/Button";
import { showLoading } from "../Loader/Loader";

interface DeleteStadiumModalProps extends Omit<ModalProps, "children"> {
  stadium: Topsoccer.Stadium.FullStadium;
  onStadiumDelete: () => void;
}

const DeleteStadiumModal: React.FC<DeleteStadiumModalProps> = ({
  stadium,
  onStadiumDelete,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>מחיקת מגרש</ModalHeader>
            <ModalBody>
              <p>בטוח שברצונך למחוק את {stadium.name}?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                לא, חזור אחורה
              </Button>
              <Button
                color="secondary"
                onPress={async () => {
                  await deleteStadium();

                  onClose();
                }}
              >
                אני בטוח
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  async function deleteStadium() {
    const hideLoading = showLoading();
    toast.loading("מוחק...");

    try {
      // await supabase.from("stadiums").delete().eq("id", stadium.id);

      toast.success("מגרש נמחק בהצלחה!");

      onStadiumDelete();
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
};

export default DeleteStadiumModal;
