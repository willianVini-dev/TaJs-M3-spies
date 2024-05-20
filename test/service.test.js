import { it, expect, describe, beforeEach, jest } from '@jest/globals'
import Service from '../src/service.js'
import fs from 'node:fs/promises'
import crypto from "node:crypto"

describe('Service Test Suite', () => {
	let _service
	const filename = 'testFile.ndjson'
	const MOCKED_HASH_PWD = 'HASHDEPASSWORD'

	describe('#create - spies', () => {
		beforeEach(() => {

			jest.spyOn(
				crypto,
				crypto.createHash.name
			).mockReturnValue({
				update: jest.fn().mockReturnThis(),
				digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD)
			})

			jest.spyOn(
				fs,
				fs.appendFile.name
			).mockResolvedValue()

			_service = new Service({ filename })
		})

		it('should call appendFile with right params',async ()=>{
			const input = {username: 'test1', password: 'pass1'}
			const expectedCreateAt = new Date().toISOString()

			// A
			jest.spyOn(
				Date.prototype,
				Date.prototype.toISOString.name
			).mockReturnValue(expectedCreateAt)

			// AA 
			await _service.create(input)

			// AAA 
			// toHaveBeenCalledWith = verifica se a função createHash foi chamada com o parametro correto
			expect(crypto.createHash).toHaveBeenCalledWith('sha256')

			const hash = crypto.createHash('sha256')
			expect(hash.update).toHaveBeenCalledWith(input.password)
			expect(hash.digest).toHaveBeenCalledWith('hex')

			const expected = JSON.stringify({
				...input,
				createdAt: expectedCreateAt,
				password: MOCKED_HASH_PWD
			}).concat('\n')

			expect(fs.appendFile).toHaveBeenCalledWith(filename, expected)
		})
	})


})