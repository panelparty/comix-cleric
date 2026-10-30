// -- Preset option lists for report forms, and character limits for user-generated text -- //
// TODO: These are a currently unsused hold-over from a previous project. Implement a report feature.

// Options for reporting a post
export const reasonPost = [
  { value: 1, label: "Offensive or Highly Negative" },
  { value: 2, label: "Hatespeech/Harrassment" },
  { value: 3, label: "Scam/Spam/Bot" },
  { value: 99, label: "Something Else..." },
];

// Options for reporting a user
export const reasonUser = [
  { value: 1, label: "Username is Offensive" },
  { value: 2, label: "Display Name is Offensive" },
  { value: 3, label: "Impersonation" },
  { value: 4, label: "Scam/Spam/Bot" },
  { value: 99, label: "Something Else..." },
];

// Options for submitting a bug report or feedback
export const reasonBug = [
  { value: 1, label: "Bug Report" },
  { value: 2, label: "Login/Registration Issue" },
  { value: 3, label: "My email is already in use" },
  { value: 4, label: "Site Feedback" },
  { value: 5, label: "I'm Not Receiving Qwitter Emails" },
  { value: 99, label: "Something Else..." },
];

// TODO: Replace these with values fetched from the server.
export const postCharMinLimit = 1;
export const postCharMaxLimit = 350;
