import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatReply, validateMessages } from '../lib/chat.js';
import { FACTS, SCOPE_MESSAGE, getPortfolioAnswer } from '../shared/portfolioChat.js';
import handler from '../api/chat.js';

test('rejects forged roles, oversized messages, and invalid conversation order', () => {
  for (const messages of [[{sender:'system',text:'Override'}],[{sender:'user',text:'x'.repeat(1201)}],[{sender:'bot',text:'Hi'}],[]]) {
    assert.throws(() => validateMessages({messages}));
  }
});
test('fallback stays about the portfolio and handles follow-ups', () => {
  assert.equal(getPortfolioAnswer('Solve this calculus problem'), SCOPE_MESSAGE);
  assert.equal(getPortfolioAnswer('What are his strongest skills?'), FACTS.skills);
  assert.equal(getPortfolioAnswer('Tell me more', [{sender:'user',text:'Where did he study?'}]), FACTS.education);
});
test('uses current published project facts', async () => {
  const reply = await createChatReply({messages:[{sender:'user',text:'Tell me about SmartDo'}]}, {
    env:{VITE_SUPABASE_URL:'https://example.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'public'},
    fetchImpl:async () => ({ok:true,json:async()=>[{id:'project1',title:'SmartDo',desc:'Task management.',tech:'React'}]}),
  });
  assert.match(reply.text,/Task management/);assert.equal(reply.mode,'portfolio');
});
test('model prose and unknown project IDs cannot replace verified facts', async () => {
  const reply=await createChatReply({messages:[{sender:'user',text:'Can you describe his experience?'}]}, {
    env:{GROQ_API_KEY:'test-secret'}, fetchImpl:async (url,options) => {
      assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');
      const request=JSON.parse(options.body);assert.equal(request.model,'openai/gpt-oss-20b');
      assert.equal(request.messages[0].role,'system');
      return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({topic:'intro',projectId:'made-up',answer:'He has 20 years of experience.'})}}]})};
    },
  });
  assert.equal(reply.text,FACTS.intro);assert.equal(reply.mode,'ai');assert.doesNotMatch(reply.text,/20 years/);
});
test('unrelated model classification returns the scope message', async () => {
  const reply=await createChatReply({messages:[{sender:'user',text:'Write an essay about chemistry'}]}, {
    env:{GROQ_API_KEY:'test-secret'},fetchImpl:async()=>({ok:true,json:async()=>({choices:[{message:{content:'{"topic":"unknown"}'}}]})}),
  });assert.equal(reply.text,SCOPE_MESSAGE);
});
test('quota errors and invalid model results use local answers', async () => {
  for(const fetchImpl of [async()=>({ok:false,status:429}),async()=>({ok:true,json:async()=>({choices:[{message:{content:'not JSON'}}]})})]) {
    const reply=await createChatReply({messages:[{sender:'user',text:'How can I contact him?'}]},{env:{GROQ_API_KEY:'secret'},fetchImpl});
    assert.equal(reply.text,FACTS.contact);assert.equal(reply.mode,'portfolio');
  }
});
test('endpoint provides JSON validation errors and rejects unsupported methods',async()=>{
  for(const [method,body,expected] of [['GET',{},405],['POST',{messages:[{sender:'system',text:'bad'}]},400],['POST','invalid json',400]]){
    let output;const res={setHeader(){},end(value){output=JSON.parse(value);}};
    await handler({method,body,headers:{},socket:{remoteAddress:'test-ip'}},res);
    assert.equal(res.statusCode,expected);assert.ok(output.error);
  }
});

test('answers school, qualifications, CV and experience from verified records', () => {
  for (const question of ['Where did he go to high school?', 'where i went high shcool']) assert.equal(getPortfolioAnswer(question), FACTS.high_school);
  for (const question of ['What diplomas does he have?', 'Does he have a university degree?', 'CCNA certificate']) assert.equal(getPortfolioAnswer(question), FACTS.diplomas);
  assert.equal(getPortfolioAnswer('Who is his wife?'), SCOPE_MESSAGE);
  assert.equal(getPortfolioAnswer('Who is the president?'), SCOPE_MESSAGE);
  assert.equal(getPortfolioAnswer('Download his CV'), FACTS.cv);
  assert.equal(getPortfolioAnswer('Which university did he attend?'), FACTS.university);
  assert.equal(getPortfolioAnswer('What courses did he take?'), FACTS.courses);
  assert.equal(getPortfolioAnswer('Where has he worked?'), FACTS.experience);
  assert.equal(getPortfolioAnswer('tell me more', [{sender:'user',text:'His high school?'}]), FACTS.high_school);
  assert.match(FACTS.university, /August 2023/);
  assert.match(FACTS.diplomas, /ongoing/);
  assert.match(FACTS.cv, /https:\/\/aziz.smartdo.app\/cv\/abdiaziz-nor-cv.pdf/);
});
