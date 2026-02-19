# Polis 한국어(ko) 번역 가이드

이 문서는 Polis의 한국어 번역 키를 정리한 참고 자료입니다.

## 번역 파일 경로

| 클라이언트 | 파일 경로 | 모듈 형식 |
|---|---|---|
| client-participation | `client-participation/js/strings/ko.js` | CommonJS (`module.exports`) |
| client-participation-alpha | `client-participation-alpha/src/strings/ko.js` | ES Module (`export default`) |
| client-admin | `client-admin/src/strings/ko.js` | ES Module (`export default`) |

## 로더 파일 경로

| 클라이언트 | 파일 경로 |
|---|---|
| client-participation | `client-participation/js/strings.js` |
| client-participation-alpha | `client-participation-alpha/src/strings/strings.js` |
| client-admin | `client-admin/src/strings/strings.js` |

## 검증 방법

- `make start` 후 브라우저에서 `?ui_lang=ko` 파라미터로 한국어 UI 확인
- 또는 브라우저 언어 설정을 한국어로 변경하여 자동 감지 확인

---

## client-participation / client-participation-alpha 공통 번역 키

| 키 | 영어 원문 | 한국어 번역 |
|---|---|---|
| `participantHelpWelcomeText` | Welcome to a new kind of conversation — vote on other people's statements — the more the better. | 새로운 형태의 대화에 오신 것을 환영합니다 — 다른 사람들의 의견에 투표하세요 — 많이 할수록 좋습니다. |
| `agree` | Agree | 동의 |
| `disagree` | Disagree | 비동의 |
| `pass` | Pass / Unsure | 넘기기 / 잘 모르겠음 |
| `writePrompt` | Share your perspective (you are not replying — submit a stand-alone statement) | 의견을 공유하세요 (답글이 아닌 독립적인 의견을 제출해 주세요) |
| `anonPerson` | Anonymous | 익명 |
| `importantCheckbox` | Important/Significant | 중요함/의미 있음 |
| `importantCheckboxDesc` | Check this box if you believe this statement is especially important to you or is highly relevant to the conversation... | 이 의견이 본인에게 특히 중요하거나 대화와 매우 관련이 있다고 생각하면 이 체크박스를 선택하세요... |
| `howImportantPrompt` | How important is this statement? | 이 의견이 얼마나 중요한가요? |
| `howImportantLow` | Low | 낮음 |
| `howImportantMedium` | Medium | 보통 |
| `howImportantHigh` | High | 높음 |
| `modSpam` | Spam | 스팸 |
| `modOffTopic` | Off Topic | 주제에서 벗어남 |
| `modImportant` | Important | 중요 |
| `modSubmitInitialState` | Skip (none of the above), next statement | 건너뛰기 (해당 없음), 다음 의견 |
| `modSubmit` | Done, next statement | 완료, 다음 의견 |
| `x_wrote` | wrote: | 작성: |
| `comments_remaining` | {{num_comments}} remaining | {{num_comments}}개 남음 |
| `comments_remaining2` | {{num_comments}} remaining statements | {{num_comments}}개의 의견이 남아 있습니다 |
| `noCommentsYet` | There aren't any statements yet. | 아직 의견이 없습니다. |
| `noCommentsYetSoWrite` | Get this conversation started by adding a statement. | 의견을 추가하여 대화를 시작하세요. |
| `noCommentsYetSoInvite` | Get this conversation started by inviting more participants, or add a statement. | 더 많은 참여자를 초대하거나 의견을 추가하여 대화를 시작하세요. |
| `noCommentsYouVotedOnAll` | You've voted on all the statements. | 모든 의견에 투표하셨습니다. |
| `noCommentsTryWritingOne` | If you have something to add, try writing your own statement. | 추가하고 싶은 내용이 있다면, 직접 의견을 작성해 보세요. |
| `convIsClosed` | This conversation is closed. | 이 대화는 종료되었습니다. |
| `noMoreVotingAllowed` | No further voting is allowed. | 추가 투표가 허용되지 않습니다. |
| `group_123` | Group: | 그룹: |
| `comment_123` | Statement: | 의견: |
| `majorityOpinion` | Majority Opinion | 다수 의견 |
| `majorityOpinionShort` | Majority | 다수 |
| `info` | Info | 정보 |
| `helpWhatAmISeeingTitle` | What am I seeing? | 무엇을 보고 있나요? |
| `helpWhatAmISeeing` | You are represented by the blue circle and grouped with others who share your perspective. | 파란색 원이 당신을 나타내며, 비슷한 관점을 가진 사람들과 함께 그룹으로 묶여 있습니다. |
| `heresHowGroupVoted` | Here's how Group {{GROUP_NUMBER}} voted: | 그룹 {{GROUP_NUMBER}}의 투표 결과: |
| `one_person` | {{x}} person | {{x}}명 |
| `x_people` | {{x}} people | {{x}}명 |
| `acrossAllPtpts` | Across all participants: | 전체 참여자 기준: |
| `xPtptsSawThisComment` | saw this statement | 명이 이 의견을 봤습니다 |
| `xOfThoseAgreed` | of those participants agreed | 명이 동의했습니다 |
| `xOfthoseDisagreed` | of those participants disagreed | 명이 비동의했습니다 |
| `opinionGroups` | Opinion Groups | 의견 그룹 |
| `topComments` | Top Statements | 주요 의견 |
| `divisiveComments` | Divisive Statements | 논쟁적인 의견 |
| `pctAgreed` | {{pct}}% Agreed | {{pct}}% 동의 |
| `pctDisagreed` | {{pct}}% Disagreed | {{pct}}% 비동의 |
| `pctAgreedLong` | {{pct}}% of everyone who voted on statement {{comment_id}} agreed. | 의견 {{comment_id}}에 투표한 전체 참여자 중 {{pct}}%가 동의했습니다. |
| `pctAgreedOfGroup` | {{pct}}% of Group {{group}} Agreed | 그룹 {{group}}의 {{pct}}%가 동의 |
| `pctDisagreedOfGroup` | {{pct}}% of Group {{group}} Disagreed | 그룹 {{group}}의 {{pct}}%가 비동의 |
| `pctDisagreedLong` | {{pct}}% of everyone who voted on statement {{comment_id}} disagreed. | 의견 {{comment_id}}에 투표한 전체 참여자 중 {{pct}}%가 비동의했습니다. |
| `pctAgreedOfGroupLong` | {{pct}}% of those in group {{group}} who voted on statement {{comment_id}} agreed. | 그룹 {{group}}에서 의견 {{comment_id}}에 투표한 참여자 중 {{pct}}%가 동의했습니다. |
| `pctDisagreedOfGroupLong` | {{pct}}% of those in group {{group}} who voted on statement {{comment_id}} disagreed. | 그룹 {{group}}에서 의견 {{comment_id}}에 투표한 참여자 중 {{pct}}%가 비동의했습니다. |
| `participantHelpGroupsText` | You are represented by the blue circle and grouped with others who share your perspective. | 파란색 원이 당신을 나타내며, 비슷한 관점을 가진 사람들과 함께 그룹으로 묶여 있습니다. |
| `participantHelpGroupsNotYetText` | The visualization will appear once 7 participants have begun voting | 7명의 참여자가 투표를 시작하면 시각화가 나타납니다 |
| `helpWhatAreGroupsDetail` | Click on your group or others to explore each group's opinions. Majority opinions are those most widely shared across groups. | 자신의 그룹이나 다른 그룹을 클릭하여 각 그룹의 의견을 살펴보세요. 다수 의견은 그룹 간에 가장 널리 공유되는 의견입니다. |
| `helpWhatDoIDoTitle` | What do I do? | 어떻게 하나요? |
| `helpWhatDoIDo` | Vote on other people's statements by clicking 'agree' or 'disagree'. Write a statement... | '동의' 또는 '비동의'를 클릭하여 다른 사람들의 의견에 투표하세요... |
| `writeCommentHelpText` | Are your perspectives or experiences missing from the conversation? If so, add them... | 대화에서 빠진 관점이나 경험이 있나요? 있다면, 아래 상자에 추가하세요... |
| `helpWriteListIntro` | What makes for a good statement? | 좋은 의견이란? |
| `helpWriteListStandalone` | A stand-alone idea | 독립적인 아이디어 |
| `helpWriteListRaisNew` | A new perspective, experience, or issue | 새로운 관점, 경험 또는 이슈 |
| `helpWriteListShort` | Clear & concise wording (limited to 140 characters) | 명확하고 간결한 표현 (140자 제한) |
| `tip` | Tip: | 팁: |
| `commentWritingTipsHintsHeader` | Tips for writing statements | 의견 작성 팁 |
| `tipCharLimit` | Statements are limited to {{char_limit}} characters. | 의견은 {{char_limit}}자로 제한됩니다. |
| `tipCommentsRandom` | Statements are displayed randomly and you are not replying directly... | 의견은 무작위로 표시되며, 다른 사람의 의견에 직접 답글을 다는 것이 아닙니다... |
| `tipOneIdea` | Break up long statements that contain multiple ideas... | 여러 아이디어가 포함된 긴 의견은 나누어 주세요... |
| `tipNoQuestions` | Statements should not be in the form of a question... | 의견은 질문 형태가 아니어야 합니다... |
| `commentTooLongByChars` | Statement length limit exceeded by {{CHARACTERS_COUNT}} characters. | 의견 길이가 {{CHARACTERS_COUNT}}자 초과되었습니다. |
| `submitComment` | Submit | 제출 |
| `commentSent` | Statement submitted! Only other participants will see your statement... | 의견이 제출되었습니다! 다른 참여자들만 당신의 의견을 보고 동의 또는 비동의할 수 있습니다. |
| `commentSendFailed` | There was an error submitting your statement. | 의견 제출 중 오류가 발생했습니다. |
| `commentSendFailedEmpty` | There was an error submitting your statement - Statement should not be empty. | 의견 제출 중 오류가 발생했습니다 - 의견이 비어 있으면 안 됩니다. |
| `commentSendFailedTooLong` | There was an error submitting your statement - Statement is too long. | 의견 제출 중 오류가 발생했습니다 - 의견이 너무 깁니다. |
| `commentSendFailedDuplicate` | There was an error submitting your statement - An identical statement already exists. | 의견 제출 중 오류가 발생했습니다 - 동일한 의견이 이미 존재합니다. |
| `commentErrorDuplicate` | Duplicate! That statement already exists. | 중복! 해당 의견이 이미 존재합니다. |
| `commentErrorConversationClosed` | This conversation is closed. No further statements can be submitted. | 이 대화는 종료되었습니다. 더 이상 의견을 제출할 수 없습니다. |
| `xidRequired` | This conversation requires an XID (external identifier) to participate... | 이 대화에 참여하려면 XID(외부 식별자)가 필요합니다... |
| `commentIsEmpty` | Statement is empty | 의견이 비어 있습니다 |
| `commentIsTooLong` | Statement is too long | 의견이 너무 깁니다 |
| `hereIsNextStatement` | Vote success. Navigate up to see the next statement. | 투표 성공. 위로 이동하여 다음 의견을 확인하세요. |
| `voteErrorGeneric` | Apologies, your vote failed to send... | 죄송합니다, 투표 전송에 실패했습니다... |
| `showTranslationButton` | Activate third-party translation | 제3자 번역 활성화 |
| `hideTranslationButton` | Deactivate Translation | 번역 비활성화 |
| `thirdPartyTranslationDisclaimer` | Translation provided by a third party | 제3자가 제공한 번역 |
| `notificationsAlreadySubscribed` | You are subscribed to updates for this conversation. | 이 대화의 업데이트를 구독 중입니다. |
| `notificationsGetNotified` | Get notified when more statements arrive: | 더 많은 의견이 도착하면 알림 받기: |
| `notificationsEnterEmail` | Enter your email address to get notified when more statements arrive: | 더 많은 의견이 도착하면 알림을 받을 이메일 주소를 입력하세요: |
| `labelEmail` | Email | 이메일 |
| `notificationsSubscribeButton` | Subscribe | 구독 |
| `notificationsSubscribeErrorAlert` | Error subscribing | 구독 오류 |
| `privacy` | Privacy | 개인정보 보호 |
| `TOS` | TOS | 이용약관 |
| `tipStarred` | Marked as important. | 중요로 표시되었습니다. |
| `topic_good_01` | What should we do about the ping pong room? | 탁구실에 대해 어떻게 해야 할까요? |
| `topic_good_01_reason` | open ended, anyone can have an opinion on answers to this question | 열린 질문으로, 누구나 이 질문의 답에 대한 의견을 가질 수 있습니다 |
| `topic_good_02` | What do you think about the new proposal? | 새로운 제안에 대해 어떻게 생각하시나요? |
| `topic_good_02_reason` | open ended, anyone can have an opinion on answers to this question | 열린 질문으로, 누구나 이 질문의 답에 대한 의견을 가질 수 있습니다 |
| `topic_good_03` | Can you think of anything that's slowing productivity? | 생산성을 저하시키는 요인이 있나요? |
| `topic_bad_01` | everyone report your launch readiness | 모두 출시 준비 상태를 보고하세요 |
| `topic_bad_01_reason` | people from various teams will be voting on the responses... | 다양한 팀의 사람들이 응답에 투표하게 되지만... |
| `topic_bad_02` | what are our launch blockers? | 출시를 막는 요인은 무엇인가요? |

## client-participation-alpha 전용 추가 키

| 키 | 영어 원문 | 한국어 번역 |
|---|---|---|
| `xidOidcConflictWarning` | Warning: You are currently signed-in to polis, but have opened a conversation with an XID token... | 경고: 현재 Polis에 로그인되어 있지만, XID 토큰이 포함된 대화를 열었습니다... |
| `invite_code_required_short` | Invite Code Required | 초대 코드 필요 |
| `invite_code_required_long` | An invite code is required to participate in this conversation | 이 대화에 참여하려면 초대 코드가 필요합니다 |
| `invite_code_prompt` | Enter Invite Code | 초대 코드 입력 |
| `submit_invite_code` | Submit Invite Code | 초대 코드 제출 |
| `invite_code_invalid` | The provided invite code was invalid. Please try again. | 제공된 초대 코드가 유효하지 않습니다. 다시 시도해 주세요. |
| `invite_code_accepted_message` | Invite accepted. Your login code is: {{login_code}}... | 초대가 수락되었습니다. 로그인 코드: {{login_code}}... |
| `invite_code_accepted_message_no_code` | Invite accepted. | 초대가 수락되었습니다. |
| `login_code_prompt` | Enter Login Code | 로그인 코드 입력 |
| `submit_login_code` | Submit Login Code | 로그인 코드 제출 |
| `login_code_invalid` | The provided login code was invalid. Please try again. | 제공된 로그인 코드가 유효하지 않습니다. 다시 시도해 주세요. |
| `login_success` | Success! You are now logged in. | 성공! 로그인되었습니다. |
| `submitting` | Submitting... | 제출 중... |
| `or_text` | or | 또는 |
| `copy` | Copy | 복사 |
| `copied` | Copied | 복사됨 |
| `ok_got_it` | OK, got it | 확인했습니다 |
| `invites_link` | Invites | 초대 |
| `invites_wave_sentence` | You are in wave {{wave}}. Joined {{date}} | {{wave}}차에 해당합니다. {{date}}에 참여함 |
| `invites_instructions` | Copy and share these invite codes to invite new participants: | 새 참여자를 초대하려면 이 초대 코드를 복사하여 공유하세요: |
| `invites_none` | You don't have any invites yet. | 아직 초대가 없습니다. |
| `invite_status_unused` | unused | 미사용 |
| `invite_status_used` | used | 사용됨 |
| `invite_status_revoked` | revoked | 취소됨 |
| `invite_status_expired` | expired | 만료됨 |

## client-admin 번역 키

| 키 | 영어 원문 | 한국어 번역 |
|---|---|---|
| `share_but_no_comments_warning` | This conversation has no comments. We recommend you add a few comments before inviting participants... | 이 대화에는 의견이 없습니다. 참여자를 초대하기 전에 몇 가지 의견을 추가하는 것을 권장합니다... |
| `share_but_no_visible_comments_warning` | This conversation has no visible comments. We recommend you add a few comments... | 이 대화에는 표시되는 의견이 없습니다. 참여자를 초대하기 전에 몇 가지 의견을 추가하거나 기존 의견을 검토하는 것을 권장합니다... |
| `no_permission` | Your account does not have the permissions to view this page. | 이 페이지를 볼 수 있는 권한이 없습니다. |
