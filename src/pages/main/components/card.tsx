import { Button, Card, Grid, Loading, Text } from "@nextui-org/react";
import { useCallback } from "react";

interface IProps {
  title: string;
  description: string;
  buttonTitle: string;
  onClick: () => void;
  isLoading: boolean;
}

export function SelectTestCard(props: IProps) {
  const { title, description, buttonTitle, onClick, isLoading } = props;

  const renderBtn = useCallback(() => {
    if (isLoading) {
      return (
        <Button bordered disabled>
          <Loading type="points" color="currentColor" size="sm" />
        </Button>
      );
    }

    return <Button onPress={onClick}>{buttonTitle}</Button>;
  }, [isLoading]);

  return (
    <Card css={{ p: "$6", mw: "400px" }}>
      <Card.Header>
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text h4 css={{ lineHeight: "$xs" }}>
              {title}
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2" }}>
        <Text>{description}</Text>
      </Card.Body>
      <Card.Footer>{renderBtn()}</Card.Footer>
    </Card>
  );
}
