export function identifyAffirmation(command: string) {
  return /\b(?:yes|yeah|yep|yup|yas|aye|affirmative|sure|ok|okay|please|agree)\b/i.test(command);
}
