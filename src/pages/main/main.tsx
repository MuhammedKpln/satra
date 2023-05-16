import useCheckMobileScreen from "@/hooks/useCheckScreenWidth";
import { RoutePath } from "@/routes";
import { useQuestionsStore } from "@/stores/questions.store";
import { Grid, Modal, Text } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutlet,
} from "react-router-dom";
import Select, { ActionMeta, SingleValue } from "react-select";
import { SelectTestCard } from "./components/card";
import { SystemDown } from "./components/system_down";

export default function MainPage() {
  const isSystemDown = useLoaderData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const fetchQuestionsFromFolder = useQuestionsStore(
    (state) => state.fetchQuestionsFromFolder,
  );
  const fetchQuestions = useQuestionsStore((state) => state.fetchQuestions);
  const questionLoadingState = useQuestionsStore((state) => state.loadingState);
  const isMobile = useCheckMobileScreen();

  const folders = useMemo(() => {
    return Array(Number(import.meta.env.VITE_FOLDER_SIZE))
      .fill(1)
      .map((_, index) => {
        return {
          value: index + 1,
          label: `Pärm ${index + 1}`,
        };
      });
  }, []);

  const navigateFinalQuiz = useCallback(() => {
    fetchQuestions().then(() => {
      navigate(RoutePath.SlutProv);
    });
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

  if (isSystemDown) {
    return <SystemDown />;
  }

  if (outlet) {
    return <Outlet />;
  }

  return (
    <>
      <Grid.Container justify="space-around" gap={2}>
        <Grid md={6}>
          <SelectTestCard
            title={t("testHeader")}
            description={t("testDesc")}
            buttonTitle={t("train")}
            onClick={navigateQuizzes}
            isLoading={false}
          />
        </Grid>
        <Grid md={6}>
          <SelectTestCard
            title={t("teoriHeader")}
            description={t("teoriDesc")}
            buttonTitle={t("teori")}
            onClick={navigateFinalQuiz}
            isLoading={questionLoadingState}
          />
        </Grid>

        <Modal
          open={isModalOpen}
          onClose={onCloseHandler}
          closeButton
          blur={!isMobile}
          fullScreen={isMobile}
          css={{
            height: !isMobile ? "60vw" : undefined,
          }}
        >
          <Modal.Header>
            <Text h4>{t("chooseTrain")}</Text>
          </Modal.Header>

          <Modal.Body>
            <Select options={folders} onChange={onSelectFolder} />
          </Modal.Body>
        </Modal>
      </Grid.Container>
    </>
  );
}
