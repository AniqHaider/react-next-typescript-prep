import type { Question } from '../types';
import { reactQuestionsA } from './react1';
import { reactQuestionsB } from './react2';
import { nextQuestionsA } from './next1';
import { nextQuestionsB } from './next2';
import { typescriptQuestions } from './typescript';

export const questions: Question[] = [
	...reactQuestionsA,
	...reactQuestionsB,
	...nextQuestionsA,
	...nextQuestionsB,
	...typescriptQuestions
];
