const { WebClient } = require('@slack/web-api');
const slackToken = process.env.SLACK_TOKEN;

const web = new WebClient(slackToken);

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event) => {
  console.log(event)
  if (event.body) {
    const urlEncoded = Buffer.from(event.body, 'base64').toString();
    const params = new URLSearchParams(urlEncoded);
    const text = params.get('text');
    if (text && text.match(/^(why|למה)/i)) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          response_type: 'in_channel',
          text: `The answer to \`${text}\` is:\nאלעד אשם!`,
        }),
      };
    }
    if (text && text.match(/^(open)/i)) {
      await web.views.open({
        trigger_id: event.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'view_1',
          title: {
            type: 'plain_text',
            text: 'My App',
            emoji: true,
          },
          submit: {
            type: 'plain_text',
            text: 'Submit',
            emoji: true,
          },
          close: {
            type: 'plain_text',
            text: 'Cancel',
            emoji: true,
          },
          blocks: [
            {
              type: 'input',
              block_id: 'input_c',
              element: {
                type: 'plain_text_input',
                action_id: 'plain_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Enter some plain text',
                },
              },
              label: {
                type: 'plain_text',
                text: 'Plain text input',
                emoji: true,
              },
            },
          ],
        },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };

    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        response_type: 'in_channel',
        text: `Please search in google <https://www.google.com/search?q=${encodeURIComponent(text)}|${text}>`,
      }),
    };
  }
  const response = {
    statusCode: 200,
    body: 'אלעד אשם!',
  };
  return response;
};
