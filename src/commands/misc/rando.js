module.exports = {
    name: 'randomverse',
    description: 'Obtains a random verse from the Bible',
    callback: async (client, interaction) => {
     try {
        const fetch = await import('node-fetch');
        const response = await fetch.default('https://labs.bible.org/api/?passage=random&type=json');
        const data = await response.json();

        // API provides the data in an Array so I'm going to access the information by pulling the first item []
        const verseData = data[0];

        // Using the first Item in the array (and the only item (our verse)), I'm now just extracting the specific details
        const verse = verseData.text;
        const verseNum = verseData.verse;
        const bookName = verseData.bookname;
        const chapter = verseData.chapter;      

        const embed = {
            title: 'Random Bible Verse',
            description: verse,
            color: Math.floor(Math.random() * 16777215),
            fields: [
              {
                name: 'Reference',
                // Template literals are used for desired seperation and concatenation
                value: `${bookName} ${chapter}:${verseNum}`,
              },
            ],
          };
    
          await interaction.reply({ embeds: [embed] });
     } catch (error) {
        console.error(error);
            await interaction.reply('Failed to fetch a random Bible verse.');
        }
    },
};