// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

var s = {};

// Text on the card

s.participantHelpWelcomeText =
  "새로운 형태의 대화에 오신 것을 환영합니다 — 다른 사람들의 의견에 </b>투표</b>하세요 — </b>많이 할수록 좋습니다.</b>";

s.agree = "동의";
s.disagree = "비동의";
s.pass = "넘기기 / 잘 모르겠음";

s.writePrompt = "의견을 공유하세요 (답글이 아닌 독립적인 의견을 제출해 주세요)";
s.anonPerson = "익명";
s.importantCheckbox = "중요함/의미 있음";
s.importantCheckboxDesc =
  "이 의견이 본인에게 특히 중요하거나 대화와 매우 관련이 있다고 생각하면 이 체크박스를 선택하세요. 투표와 관계없이, 대화 분석에서 이 의견의 우선순위가 높아집니다.";
s.howImportantPrompt = "이 의견이 얼마나 중요한가요?";
s.howImportantLow = "낮음";
s.howImportantMedium = "보통";
s.howImportantHigh = "높음";

s.modSpam = "스팸";
s.modOffTopic = "주제에서 벗어남";
s.modImportant = "중요";
s.modSubmitInitialState = "건너뛰기 (해당 없음), 다음 의견";
s.modSubmit = "완료, 다음 의견";

s.x_wrote = "작성:";
s.comments_remaining = "{{num_comments}}개 남음";
s.comments_remaining2 = "{{num_comments}}개의 의견이 남아 있습니다";

// Text about phasing

s.noCommentsYet = "아직 의견이 없습니다.";
s.noCommentsYetSoWrite = "의견을 추가하여 대화를 시작하세요.";
s.noCommentsYetSoInvite = "더 많은 참여자를 초대하거나 의견을 추가하여 대화를 시작하세요.";
s.noCommentsYouVotedOnAll = "모든 의견에 투표하셨습니다.";
s.noCommentsTryWritingOne = "추가하고 싶은 내용이 있다면, 직접 의견을 작성해 보세요.";
s.convIsClosed = "이 대화는 종료되었습니다.";
s.noMoreVotingAllowed = "추가 투표가 허용되지 않습니다.";

// For the visualization below

s.group_123 = "그룹:";
s.comment_123 = "의견:";
s.majorityOpinion = "다수 의견";
s.majorityOpinionShort = "다수";
s.info = "정보";

s.helpWhatAmISeeingTitle = "무엇을 보고 있나요?";
s.helpWhatAmISeeing = "파란색 원이 당신을 나타내며, 비슷한 관점을 가진 사람들과 함께 그룹으로 묶여 있습니다.";
s.heresHowGroupVoted = "그룹 {{GROUP_NUMBER}}의 투표 결과:";
s.one_person = "{{x}}명";
s.x_people = "{{x}}명";
s.acrossAllPtpts = "전체 참여자 기준:";
s.xPtptsSawThisComment = "명이 이 의견을 봤습니다";
s.xOfThoseAgreed = "명이 동의했습니다";
s.xOfthoseDisagreed = "명이 비동의했습니다";
s.opinionGroups = "의견 그룹";
s.topComments = "주요 의견";
s.divisiveComments = "논쟁적인 의견";
s.pctAgreed = "{{pct}}% 동의";
s.pctDisagreed = "{{pct}}% 비동의";
s.pctAgreedLong = "의견 {{comment_id}}에 투표한 전체 참여자 중 {{pct}}%가 동의했습니다.";
s.pctAgreedOfGroup = "그룹 {{group}}의 {{pct}}%가 동의";
s.pctDisagreedOfGroup = "그룹 {{group}}의 {{pct}}%가 비동의";
s.pctDisagreedLong = "의견 {{comment_id}}에 투표한 전체 참여자 중 {{pct}}%가 비동의했습니다.";
s.pctAgreedOfGroupLong = "그룹 {{group}}에서 의견 {{comment_id}}에 투표한 참여자 중 {{pct}}%가 동의했습니다.";
s.pctDisagreedOfGroupLong = "그룹 {{group}}에서 의견 {{comment_id}}에 투표한 참여자 중 {{pct}}%가 비동의했습니다.";
s.participantHelpGroupsText =
  "파란색 원이 당신을 나타내며, 비슷한 관점을 가진 사람들과 함께 그룹으로 묶여 있습니다.";
s.participantHelpGroupsNotYetText = "7명의 참여자가 투표를 시작하면 시각화가 나타납니다";
s.helpWhatAreGroupsDetail =
  "<p>자신의 그룹이나 다른 그룹을 클릭하여 각 그룹의 의견을 살펴보세요.</p><p>다수 의견은 그룹 간에 가장 널리 공유되는 의견입니다.</p>";

// Text about writing your own statement

s.helpWhatDoIDoTitle = " 어떻게 하나요?";
s.helpWhatDoIDo =
  "'동의' 또는 '비동의'를 클릭하여 다른 사람들의 의견에 투표하세요. 의견을 작성하세요 (각각 하나의 아이디어로). 친구들을 대화에 초대하세요!";
s.writeCommentHelpText =
  "대화에서 빠진 관점이나 경험이 있나요? 있다면, 아래 상자에 </b>추가하세요</b> — </b>한 번에 하나씩</b>.";
s.helpWriteListIntro = "좋은 의견이란?";
s.helpWriteListStandalone = "독립적인 아이디어";
s.helpWriteListRaisNew = "새로운 관점, 경험 또는 이슈";
s.helpWriteListShort = "명확하고 간결한 표현 (140자 제한)";
s.tip = "팁:";
s.commentWritingTipsHintsHeader = "의견 작성 팁";
s.tipCharLimit = "의견은 {{char_limit}}자로 제한됩니다.";
s.tipCommentsRandom =
  "의견은 무작위로 표시되며, 다른 사람의 의견에 직접 답글을 다는 것이 아닙니다: <b>독립적인 의견을 추가하는 것입니다.<b>";
s.tipOneIdea =
  "여러 아이디어가 포함된 긴 의견은 나누어 주세요. 그래야 다른 사람들이 투표하기 쉬워집니다.";
s.tipNoQuestions =
  "의견은 질문 형태가 아니어야 합니다. 참여자들은 당신이 작성한 의견에 동의하거나 비동의합니다.";
s.commentTooLongByChars = "의견 길이가 {{CHARACTERS_COUNT}}자 초과되었습니다.";
s.submitComment = "제출";
s.commentSent = "의견이 제출되었습니다! 다른 참여자들만 당신의 의견을 보고 동의 또는 비동의할 수 있습니다.";

// Error notices

s.commentSendFailed = "의견 제출 중 오류가 발생했습니다.";
s.commentSendFailedEmpty = "의견 제출 중 오류가 발생했습니다 - 의견이 비어 있으면 안 됩니다.";
s.commentSendFailedTooLong = "의견 제출 중 오류가 발생했습니다 - 의견이 너무 깁니다.";
s.commentSendFailedDuplicate = "의견 제출 중 오류가 발생했습니다 - 동일한 의견이 이미 존재합니다.";
s.commentErrorDuplicate = "중복! 해당 의견이 이미 존재합니다.";
s.commentErrorConversationClosed = "이 대화는 종료되었습니다. 더 이상 의견을 제출할 수 없습니다.";
s.xidRequired = "이 대화에 참여하려면 XID(외부 식별자)가 필요합니다. 제공받은 올바른 링크를 사용해 주세요.";
s.commentIsEmpty = "의견이 비어 있습니다";
s.commentIsTooLong = "의견이 너무 깁니다";
s.hereIsNextStatement = "투표 성공. 위로 이동하여 다음 의견을 확인하세요.";
s.voteErrorGeneric = "죄송합니다, 투표 전송에 실패했습니다. 연결 상태를 확인하고 다시 시도해 주세요.";

// Text for the third party translation that appears on the cards

s.showTranslationButton = "제3자 번역 활성화";
s.hideTranslationButton = "번역 비활성화";
s.thirdPartyTranslationDisclaimer = "제3자가 제공한 번역";

// Text about notifications and subscriptions and embedding

s.notificationsAlreadySubscribed = "이 대화의 업데이트를 구독 중입니다.";
s.notificationsGetNotified = "더 많은 의견이 도착하면 알림 받기:";
s.notificationsEnterEmail = "더 많은 의견이 도착하면 알림을 받을 이메일 주소를 입력하세요:";
s.labelEmail = "이메일";
s.notificationsSubscribeButton = "구독";
s.notificationsSubscribeErrorAlert = "구독 오류";

s.addPolisToYourSite = "<img style='height: 20px; margin: 0px 4px;' src='{{URL}}'/>";

// Footer

s.privacy = "개인정보 보호";
s.TOS = "이용약관";

// Experimental features

s.importantCheckbox = "이 의견은 중요합니다";
s.howImportantPrompt = "이 의견이 얼마나 중요한가요?";
s.howImportantLow = "낮음";
s.howImportantMedium = "보통";
s.howImportantHigh = "높음";
s.tipStarred = "중요로 표시되었습니다.";

s.modSpam = "스팸";
s.modOffTopic = "주제에서 벗어남";
s.modImportant = "중요";
s.modSubmitInitialState = "건너뛰기 (해당 없음), 다음 의견";
s.modSubmit = "완료, 다음 의견";

s.topic_good_01 = "탁구실에 대해 어떻게 해야 할까요?";
s.topic_good_01_reason = "열린 질문으로, 누구나 이 질문의 답에 대한 의견을 가질 수 있습니다";
s.topic_good_02 = "새로운 제안에 대해 어떻게 생각하시나요?";
s.topic_good_02_reason = "열린 질문으로, 누구나 이 질문의 답에 대한 의견을 가질 수 있습니다";
s.topic_good_03 = "생산성을 저하시키는 요인이 있나요?";

s.topic_bad_01 = "모두 출시 준비 상태를 보고하세요";
s.topic_bad_01_reason =
  "다양한 팀의 사람들이 응답에 투표하게 되지만, 자신 있게 투표할 만큼의 지식이 부족할 수 있습니다.";
s.topic_bad_02 = "출시를 막는 요인은 무엇인가요?";
s.topic_bad_02_reason = "";

module.exports = s;
