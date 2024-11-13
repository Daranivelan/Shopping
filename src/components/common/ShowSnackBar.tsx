import { Alert, SlideProps, Slide } from "@mui/material";

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

type ShowSnackBarProps = {
  dispatch: React.Dispatch<any>;
  message: string;
  color: string;
  textColor?: string;
};

export const ShowSnackBar = ({
  dispatch,
  message,
  color,
  textColor,
}: ShowSnackBarProps) => {
  dispatch({
    type: "TOGGLE_SNACKBAR_DATA",
    payload: {
      open: true,
      children: (
        <Alert
          onClose={() =>
            dispatch({
              type: "TOGGLE_SNACKBAR_DATA",
              payload: { open: false },
            })
          }
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: color,
            color: textColor || "white",
          }}
        >
          {message}
        </Alert>
      ),
      props: {
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        autoHideDuration: 3000,
        onClose: () =>
          dispatch({
            type: "TOGGLE_SNACKBAR_DATA",
            payload: { open: false },
          }),
        TransitionComponent: SlideTransition,
      },
    },
  });
};
