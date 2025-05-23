import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

interface ChangelogProps {
  open: boolean;
  handleClose: () => void;
}

const Changelog: React.FC<ChangelogProps> = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
          📝 Changelog
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.3)" }} />
        
        <Typography 
          variant="h6" 
          component="p" 
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Version 0.0.1 - Testing stuff:
        </Typography>
        
        <Typography 
          id="modal-modal-description" 
          sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
        >
          • Added a changelog modal, yay!
          {"\n"}• The SR rates are now good: 9% overall, 2.25% for LD SRs & 6.75% for normal SRs.
          {"\n"}• LD banner only spawns LD SRs too.
        </Typography>
        
        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "70vh",
  bgcolor: "#282c34",
  color: "#fff",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  outline: "none",
  overflowY: "auto",
};

export default Changelog;
