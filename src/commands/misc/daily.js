module.exports = {
    name: 'dailyverse',
    description: 'Get the daily Bible verse',
    // Callback is used to define the behavior and actions that need to be performed when the command is triggered.
    callback: async (client, interaction) => {
      try {

        const fetch = await import('node-fetch');
        const response = await fetch.default('https://beta.ourmanna.com/api/v1/get?format=json&order=daily');
        const data = await response.json();
  
        const verseDetails = data.verse.details;
        const verse = verseDetails.text;
        const reference = verseDetails.reference;
  
        const embed = {
          title: 'Daily Bible Verse',
          description: verse,
          /* For a unique spin a random color for the embed is generated by using 16777215 as the upper bound (max color value
            in decimal) which is essentially white but in decimal format. This means all colors are possible besides white.
          */
          color: Math.floor(Math.random() * 16777215),
          fields: [
            {
              name: 'Reference',
              value: reference,
            },
          ],
        };
  
        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.reply('Failed to fetch the daily Bible verse.');
      }
    },
  };
  