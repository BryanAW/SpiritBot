const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'verse',
    description: 'Get a Bible verse related to a specific topic',
    options: [
      {
        name: 'related-to',
        description: 'Select the topic for the verse',
        type: 3,
        required: true,
        choices: [
          {
            name: 'Lust',
            value: 'Lust',
          },
          {
            name: 'Greed',
            value: 'Greed',
          },
          {
            name: 'Idolatry',
            value: 'Idolatry',
          },
        ],
      },
    ],
    callback: async (client, interaction) => {
      const relatedTo = interaction.options.getString('related-to');
  
      try {
        const filePath = path.join(__dirname, '..', '..', 'texts', `${relatedTo}.txt`);
        const content = fs.readFileSync(filePath, 'utf8');
        const verses = content.trim().split('\n'); // Assuming each verse is separated by a new line
  
        // Picks a random verse from a random line (each line contains a verse)
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        /* 
        Match is used to search for patterns within the text file.
        (.+?) Captures any characters one or more times in a non-greedy way until the next part of the pattern is matched.
        (\d+) Captures one or more digits, which in this case represent chapter number.
        : The colon represents a colon, for formatting.
        The other (\d+) represents the verse number.
        (.+) Captures any characters one or more times to represent the actual verse.
        */
        const verseParts = randomVerse.match(/(\d+ )?(.+?) (\d+:\d+(-\d+)?) - (.+)/);

      if (verseParts && verseParts.length >= 6) {
        const bookPrefix = verseParts[1];
        const bookName = verseParts[2];
        const verseRange = verseParts[3];
        const verseText = verseParts[5];

        const embed = {
          title: `Bible Verse - ${relatedTo}`,
          description: verseText,
          color: Math.floor(Math.random() * 16777215),
          fields: [
            {
              name: 'Reference',
              value: `${bookPrefix ? bookPrefix.trim() : ''} ${bookName} ${verseRange}`,
            },
          ],
        };
    
            await interaction.reply({ embeds: [embed] });
          } else {
            await interaction.reply('Failed to fetch the Bible verse. Please try again.');
          }
      } catch (error) {
        console.error(error);
        await interaction.reply('Failed to fetch the Bible verse.');
      }
    },
  };