import { RoutePath } from "@/routes";
import { Container, Row } from "@nextui-org/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import { SelectTestCard } from "./components/card";

export default function MainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const navigateFinalQuiz = useCallback(() => {
    navigate(RoutePath.SlutProv);

    window.console.log(outlet);
  }, []);

  const navigateQuizzes = useCallback(() => {
    navigate(RoutePath.SlutProv);
  }, []);

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
      </Container>
    </>
  );
}
