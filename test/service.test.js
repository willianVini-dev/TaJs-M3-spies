import { it, expect, describe, beforeEach, jest } from '@jest/globals'
import Service from '../src/service.js'
import fs from 'node:fs/promises'


describe('Service Test Suite', () => {
	let _service
	const filename = 'testFile.ndjson'
	beforeEach(() => {
		_service = new Service({ filename })
	})

	describe('#read', () => {
		it('Should return an empty array if the file is empty', async () => {

			jest.spyOn(
				fs,
				fs.readFile.name
			).mockResolvedValue('')


			const result = await _service.read()
			expect(result).toEqual([])
		})

		it('should return users without password if file contains users', async () => {

			// arrange
			const data = [
				{
					username: 'test1',
					password: 'password1',
					createdAt: new Date().toISOString()
				},
				{
					username: 'test2',
					password: 'password2',
					createdAt: new Date().toISOString()
				},
			]
			// simulando arquivo, transformando pra string e depois para json
			const fileContent = data
				.map(line=>JSON.stringify(line).concat('\n')).join('')

			jest.spyOn(
				fs,
				'readFile'
			).mockResolvedValue(fileContent);

			// action
			const result = await _service.read()

			// assert
			const expected = data.map(({password, ...rest})=>({...rest}))

			expect(result).toEqual(expected)

		})
	})
})