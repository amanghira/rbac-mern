/**
 * Minimal illustrative tests. Assumes your server exports an Express `app`
 * and has a User/Post model plus token issuance helper for tests.
 */
import request from 'supertest'
import { app, models, testUtils } from '../testApp.js'

describe('RBAC guards', () => {
  let admin, editor, viewer, editorToken, viewerToken, postByEditor

  beforeAll(async () => {
    ({ admin, editor, viewer } = await testUtils.seedUsers())
    editorToken = testUtils.tokenFor(editor)
    viewerToken = testUtils.tokenFor(viewer)
    postByEditor = await models.Post.create({ title:'hello', body:'body', authorId: editor._id })
  })

  test('viewer cannot create post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', viewerToken)
      .send({ title:'x', body:'y' })
    expect(res.status).toBe(403)
  })

  test('editor can delete own post but not others', async () => {
    const res1 = await request(app)
      .delete(`/api/posts/${postByEditor._id}`)
      .set('Authorization', editorToken)
    expect(res1.status).toBe(200)

    const otherPost = await models.Post.create({ title:'z', body:'z', authorId: admin._id })
    const res2 = await request(app)
      .delete(`/api/posts/${otherPost._id}`)
      .set('Authorization', editorToken)
    expect(res2.status).toBe(403)
  })
})
