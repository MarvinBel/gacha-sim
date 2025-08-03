// Version Tailwind CSS du composant Changelog (sans MUI)
import React from "react";

interface ChangelogProps {
  open: boolean;
  handleClose: () => void;
}

const Changelog: React.FC<ChangelogProps> = ({ open, handleClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white w-[90%] max-w-md max-h-[70vh] p-6 rounded-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">📝 Changelog</h2>
        <hr className="mb-4 border-gray-500" />

        <ChangelogSection
          title="Version 0.3.5 - How much to ?"
          content={`• Added a new page where you can calculate how many pulls you need to get a specific character. (Thanks to Zelpex for the idea !)
• Removed Lian & Hoyan from the list, they were causing crashed as it couldn't be pulled it made a infinite loop.
• Put the LDs characters on top of the list.
• Added a donate button, don't feel obligated and only do it if you WANT and you CAN. Tysm for using my website ❤️
• The pull order is now displayed on the pulled unit on the different pages so you know when you got which character !
• The "MySummons" now displays the pull order of the characters, so you can see which character you got first. Also pulled characters are now back in the localStorage as coockies can't store this much informations which caused this page to only show a few characters.
• Added an average SSR numbers tu Summons page & HowMuchTo page !
• Fixed the text color in the input from Summons page (Thanks teiragmon !).
• Fixed the pity counter resetting when changing tab on the website ! (Thanks teiragmon !)`}
        />

        <ChangelogSection
          title="Version 0.2.1 - Countdown"
          content={`• Tic tac, there is now a countdown page leading to the official launch of the game !!
• The banners now have images that resemble the actual game.
• Added Mio & Mizuki Makoto to the pulls ! Also removed Hoyan as she won't be part of the pull on release. Thanks to Zelpex for the images & info about Hoyan ! :D`}
        />

        <ChangelogSection
          title="Version 0.1.2 - Team maker"
          content={`• Made some updated style for better visibility.`}
        />

        <ChangelogSection
          title="Version 0.1.1 - Team maker"
          content={`• Teams are now loaded in cookies instead of local storage, so you can see your teams even after closing the browser.`}
        />

        <ChangelogSection
          title="Version 0.1.0 - Team maker"
          content={`• There is now a team maker available on the website, check it out !
• Everything is saved in your browser, so you can come back later and your team will still be there.
• There will be a beautifier update !
• There will be a "My teams" page in the future, where you can see your teams in one glimpse.`}
        />

        <ChangelogSection
          title="Version 0.0.2 - Elements display"
          content={`• Elements are now displayed in the character pages !
• On hover, you can now see tags about character's capabilities.
• You can now filter characters by element & rôle.
• Fixed the filter selection color which wasn't updated for elements.
• Lian is now back in the characters list.`}
        />

        <ChangelogSection
          title="Version 0.0.1 - Testing stuff"
          content={`• Added a changelog modal, yay!
• The SR rates are now good: 9% overall, 2.25% for LD SRs & 6.75% for normal SRs.
• LD banner only spawns LD SRs too.`}
        />

        <div className="text-right mt-6">
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangelogSection = ({ title, content }: { title: string; content: string }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <pre className="whitespace-pre-line leading-relaxed text-sm">{content}</pre>
  </div>
);

export default Changelog;
