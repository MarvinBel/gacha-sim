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
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          gutterBottom
        >
          📝 Changelog
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.3)" }} />
        <Typography
          variant="h6"
          component="p"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Version 0.2.1 - Countdown:
        </Typography>

        <Typography
          id="modal-modal-description"
          sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
        >
          • Tic tac, there is now a countdown page leading to the official launch of the game !!
          {"\n"}• The banners now have images that resemble the actual game.
          {"\n"}• Added Mio & Mizuki Makoto to the pulls ! Also removed Hoyan as she won't be part of the pull on release. Thanks to Zelpex for the images & info about Hoyan ! :D
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Version 0.1.2 - Team maker:
        </Typography>

        <Typography
          id="modal-modal-description"
          sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
        >
          • Made some updated style for better visibility.
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Version 0.1.1 - Team maker:
        </Typography>

        <Typography
          id="modal-modal-description"
          sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
        >
          • Teams are now loaded in cookies instead of local storage, so you can
          see your teams even after closing the browser.
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Version 0.1.0 - Team maker:
        </Typography>

        <Typography
          id="modal-modal-description"
          sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
        >
          • There is now a team maker available on the website, check it out !
          {"\n"}• Everything is saved in your browser, so you can come back
          later and your team will still be there.
          {"\n"}• There will be a beautifier update !{"\n"}• There will be a "My
          teams" page in the future, where you can see your teams in one
          glimpse.
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Version 0.0.2 - Elements display:
        </Typography>

        <Typography
          id="modal-modal-description"
          sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
        >
          • Elements are now displayed in the character pages !{"\n"}• On hover,
          you can now see tags about character's capabilities.
          {"\n"}• You can now filter characters by element & rôle.
          {"\n"}• Fixed the filter selection color which wasn't updated for
          elements.
          {"\n"}• Lian is now back in the characters list.
        </Typography>
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
          {"\n"}• The SR rates are now good: 9% overall, 2.25% for LD SRs &
          6.75% for normal SRs.
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
