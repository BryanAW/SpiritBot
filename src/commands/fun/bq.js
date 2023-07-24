const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');

// Define an array of Bible questions and their options
const bibleQuestions = [
    {
        question: 'Who built the Ark as per God\'s instruction?',
        options: [
            'A. Noah',
            'B. Moses',
            'C. David',
        ],
        correctAnswer: 1, // Use a 1-based index (1 for A, 2 for B, etc.)
    },
    // Add future questions here.
];

module.exports = {
    name: 'biblequiz',
    description: 'Ask a Bible quiz question with three options.',
    dm_permission: false,
    callback: async (client, interaction) => {
        try {
            // Select a random question from the Bible questions array (reduces repetitiveness)
            const randomQuestion = bibleQuestions[Math.floor(Math.random() * bibleQuestions.length)];

            const embed = new EmbedBuilder()
                .setTitle('Bible Quiz')
                .setDescription(`**Question:** ${randomQuestion.question}`)
                .setColor('Green')
                .setTimestamp(new Date());

            // Create buttons for each option
            const buttons = randomQuestion.options.map((option, index) => {
                return new ButtonBuilder()
                    .setCustomId(`option_${index + 1}`) // Add 1 to match 1-based index
                    .setLabel(option)
                    .setStyle(ButtonStyle.Primary);
            });

            // Add the buttons to an ActionRow
            const actionRow = new ActionRowBuilder().addComponents(buttons);

            // Send the question and options as a message with buttons
            const reply = await interaction.reply({
                content: `${interaction.user}, here's your Bible quiz question:`,
                embeds: [embed],
                components: [actionRow],
            });

            // Await the user's button click (option selection)
            const filter = (i) => i.customId.startsWith('option_') && i.user.id === interaction.user.id;
            const collected = await reply.awaitMessageComponent({ filter, time: 60000 });

            if (!collected) {
                await interaction.followUp('Time is up! You did not select an answer.');
                return;
            }

            const selectedOptionIndex = parseInt(collected.customId.split('_')[1]) - 1; // Convert 1-based index to 0-based
            const correctOptionIndex = randomQuestion.correctAnswer - 1; // Convert 1-based index to 0-based

            let resultMessage = '';

            if (selectedOptionIndex === correctOptionIndex) {
                resultMessage = 'Correct! You chose the right answer!';
            } else {
                resultMessage = `Incorrect! The correct answer was: ${randomQuestion.options[correctOptionIndex]}`;
            }

            // Edit the original message with the result and remove buttons
            embed.setDescription(`${resultMessage}\n\n${randomQuestion.options[correctOptionIndex]}`);
            reply.edit({ embeds: [embed], components: [] });
        } catch (error) {
            console.log(`Error with /biblequiz`);
            console.error(error);
        }
    },
};