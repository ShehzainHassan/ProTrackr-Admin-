import { Button } from "@chakra-ui/react";
const buttonHover = {
  transition: "transform 0.3s",
  _hover: {
    transform: "scale(1.05)",
  },
};

export const StyledButton = (props) => {
  const { onClick, isDisabled, colorScheme, marginLeft, children } = props;
  return (
    <Button
      marginLeft={marginLeft}
      onClick={onClick}
      isDisabled={isDisabled}
      colorScheme={colorScheme}
      _hover={buttonHover}
      sx={{
        "&:hover svg": {
          color: "white",
        },
      }}>
      {children}
    </Button>
  );
};
