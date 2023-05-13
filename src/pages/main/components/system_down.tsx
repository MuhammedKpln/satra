import { Text, useTheme } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import styles from "../main.module.scss";

export function SystemDown() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div
      className={styles.systemDownAlert}
      style={{ backgroundColor: theme?.colors.red600.value }}
    >
      <Text h4 color="white">
        {t("system_off")}
      </Text>
    </div>
  );
}
