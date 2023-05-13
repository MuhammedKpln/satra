import { RoutePath } from "@/routes";
import { useQuestionsStore } from "@/stores/questions.store";
import { Container, Modal, Row, Text } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import Select, { ActionMeta, SingleValue } from "react-select";
import { SelectTestCard } from "./components/card";

export default function MainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const fetchQuestionsFromFolder = useQuestionsStore(
    (state) => state.fetchQuestionsFromFolder,
  );

  const folders = useMemo(() => {
    return Array(15)
      .fill(1)
      .map((_, index) => {
        return {
          value: index + 1,
          label: `Pärm ${index + 1}`,
        };
      });
  }, []);

  const navigateFinalQuiz = useCallback(() => {
    navigate(RoutePath.SlutProv);

    window.console.log(outlet);
  }, []);

  const navigateQuizzes = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const onCloseHandler = useCallback(() => {
    setIsModalOpen((state) => !state);
  }, []);

  const onSelectFolder = useCallback(
    (
      option: SingleValue<{ label: string; value: number }>,
      _: ActionMeta<{ value: number; label: string }>,
    ) => {
      fetchQuestionsFromFolder(option!.value).then(() => {
        navigate(RoutePath.SlutProv);
      });
    },
    [],
  );

  if (outlet) {
    return <Outlet />;
  }

  return (
    <>
      <Container direction="row">
        <Row justify="space-around">
          <SelectTestCard
            title={t("testHeader")}
            description={t("testDesc")}
            buttonTitle={t("train")}
            onClick={navigateQuizzes}
          />
          <SelectTestCard
            title={t("teoriHeader")}
            description={t("teoriDesc")}
            buttonTitle={t("teori")}
            onClick={navigateFinalQuiz}
          />
        </Row>

        <Modal
          open={isModalOpen}
          onClose={onCloseHandler}
          closeButton
          blur
          width="50vw"
          css={{
            height: "40vw",
          }}
        >
          <Modal.Header>
            <Text h4>{t("chooseTrain")}</Text>
          </Modal.Header>

          <Modal.Body>
            <Select options={folders} onChange={onSelectFolder} />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
