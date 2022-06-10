import { IconButton } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";

export const WhatsAppButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onClick }) => {
  return (
    <>
      <svg viewBox="0 0 36 36" className="circular-chart">
        <path className="circle-bg"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path className="circle"
          strokeDasharray="100, 100"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <IconButton color='primary' onClick={(event) => {
        const button = event.currentTarget;
        button.setAttribute('disabled', '');
        button.classList.add('Mui-disabled');
        button.previousElementSibling?.classList.add('fade-in');
        setTimeout(() => {
          button.removeAttribute('disabled');
          button.classList.remove('Mui-disabled');
          button.previousElementSibling?.classList.add('fade-out');
          setTimeout(() => {
            button.previousElementSibling?.classList.remove('fade-in');
            button.previousElementSibling?.classList.remove('fade-out');
          }, 200);
        }, 15000);
        !!onClick && onClick(event);
      }}>
        <WhatsApp />
      </IconButton>
    </>
  );
};
