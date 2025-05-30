import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Divider,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

const faqList: { [key: string]: { question: string; answer: string }[] }[] = [
	{
		アクティビティ全体: [
			{
				question: 'このアクティビティでは何ができますか？',
				answer:
					'自分でアクティビティ画面を開くだけで、他の読み上げBOTと同じような事ができます。',
			},
			{
				question: '他の読み上げとの違いはなんですか？',
				answer:
					'自分が使おうとしたタイミングで、サーバー内にある読み上げがすべて使用されている事の解決と読み上げの音声設定、辞書設定を自分独自の設定ができることです。',
			},
		],
		読み上げ画面: [
			{
				question: '読み上げはこの画面以外でされませんか？',
				answer: 'どの画面でもされます。',
			},
			{
				question: '他の画面で読み上げが再生されません。',
				answer:
					'一度読み上げ画面を開き、ミュートの切り替え、その画面を開いた状態でdiscordのチャットにメッセージ送信、アクティビティの再起動のいずれかを試してみてください。',
			},
			{
				question: '画面に表示されるメッセージが実際のメッセージと異なります。',
				answer:
					'辞書登録してある単語に置換されたメッセージが表示されます。そもそもが違う場合は不具合の可能性があるので、下記のサポートサーバーorアクティビティの再起動を試してみてください。',
			},
		],
		読み上げ設定画面: [
			{
				question: '他人の音声設定が編集出来てしまいます。',
				answer:
					'このサービスでは編集可能です。他の人のを編集しても本人に伝わることはなく、あくまで貴方のその人に対しての設定という事になります。',
			},
			{
				question: '男性1を設定したときに感情・感情レベルを設定できません。',
				answer: '音声データを作成してるサービスの仕様です。',
			},
			{
				question: 'ボイスロイド等を使用したいです。',
				answer: 'コストと相談します。',
			},
		],
		辞書設定: [
			{
				question:
					'置換前単語を誤って追加してしまいました。削除はできませんか？',
				answer:
					'現在はできません。有効/無効設定の切り替えで対応してください。特別な事情がある場合は下記のサポートサーバーで相談してください。',
			},
			{
				question: '有効/無効を切り替えたら他の人が困るんじゃないですか？',
				answer: '有効/無効設定は個人毎の設定のため他の人には反映されません。',
			},
			{
				question: '追加・編集するときに追加ボタンが押せません。',
				answer:
					'3文字以上50文字以内という制限があります。この制限を守らないと押せません。',
			},
		],
	},
];

export default function HelpPage() {
	return (
		<Box maxWidth="800px" mx="auto" mt={5} px={2}>
			<Typography variant="h4" gutterBottom>
				ヘルプページ
			</Typography>

			<Divider sx={{ my: 3 }} />

			<Typography variant="h6" gutterBottom>
				画面ガイド
			</Typography>
			<ol>
				<li>
					{<Link to={'/tts'}>読み上げ:　</Link>}
					discordに送信されたメッセージの確認や読み上げのミュート切り替えをします。
				</li>

				<li>
					{<Link to={'/ttsSetting'}>読み上げ設定:　</Link>}
					読み上げ音声の設定をします。ほかの人の読み上げ設定を変更することも可能です。
					<br />
					本人に変更した内容が伝わることはないので、特定の人だけ音声をわかりやすくすることも可能です。
				</li>

				<li>
					{<Link to={'/dictionaries'}>辞書設定:　</Link>}
					単語置換の辞書設定を行います。右上のボタンで新規辞書の追加、編集ボタンで置換後の単語を変更できます。
					<br />
					又、単語毎に置換の有効/無効を切り替え置換しないようにすることもできます。
					<br />
					単語の有効範囲を「全体」と「自分のみ」のいずれかで設定できるので、自分だけの単語辞書を作成しましょう。
				</li>
			</ol>

			<Divider sx={{ my: 4 }} />

			<Typography variant="h6" gutterBottom>
				よくある質問（FAQ）
			</Typography>

			{faqList.map((faqCategory, idx) =>
				Object.entries(faqCategory).map(([category, items]) => (
					<Box key={`${idx}-${category}`} mb={4}>
						<Typography
							variant="subtitle1"
							sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}
						>
							{category}
						</Typography>

						{items.map((faq, i) => (
							<Accordion key={`${category}-${i.toString()}`}>
								<AccordionSummary expandIcon={<ExpandMoreIcon />}>
									<Typography>{faq.question}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography color="text.secondary">{faq.answer}</Typography>
								</AccordionDetails>
							</Accordion>
						))}
					</Box>
				)),
			)}
			<Divider sx={{ my: 4 }} />

			<Typography variant="h6" gutterBottom>
				お問い合わせ
			</Typography>
			<Typography variant="body2">
				サポートが必要な場合は、admin@example.com までご連絡ください。
			</Typography>
		</Box>
	);
}
