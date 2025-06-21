import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const BootstrapTooltip = styled(({ className, slotProps, ...props }) => {
  const defaultSlotProps = {
    popper: {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -14],
          },
        },
      ],
    },
  };

  return (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      slotProps={slotProps ?? defaultSlotProps}
    />
  );
})(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default BootstrapTooltip;