import SrcStorage from "../src/utils/src-storage";

describe('SrcStorage', () => {
	let srcStorage;
	const src = 'http://localhost:3000/tests/mocks/mock-wscbundle.js';

	beforeEach(() => {
		srcStorage = new SrcStorage();
	});

	afterEach(() => {
		const script = document.querySelector('script[src="' + src + '"]');

		if (script) {
			script.remove();
		}

		srcStorage = null;
	});

	it('should create storage', () => {
		expect(srcStorage._storage).to.be.exist;
	})

	it('should add the src of the script to the storage', () => {
		expect(srcStorage.has(src)).to.be.false;

		srcStorage.add(src)
		expect(srcStorage.has(src)).to.be.true;
	});

	it('should create arrays of callbacks', () => {
		srcStorage.add(src);

		expect(srcStorage.get(src).resolves).to.be.exist;
		expect(srcStorage.get(src).rejects).to.be.exist;
	});

	it('should add callbacks to the storage', () => {
		srcStorage.add(src);

		expect(srcStorage.get(src).resolves.length).to.be.equal(0);
		expect(srcStorage.get(src).rejects.length).to.be.equal(0);

		srcStorage.addCallbacks(src, () => { }, () => { });

		expect(srcStorage.get(src).resolves.length).to.be.equal(1);
		expect(srcStorage.get(src).rejects.length).to.be.equal(1);
	});

	it('should execute eachOnLoad callback', () => {
		srcStorage.add(src);
		srcStorage.addCallbacks(src, () => { }, () => { });

		const spy = sinon.spy();

		srcStorage.eachOnLoad(src, spy);

		expect(spy.calledOnce).to.be.true;
	});

	it('should execute onload callback', () => {
		const spy = sinon.spy();

		srcStorage.add(src);
		srcStorage.addCallbacks(src, spy, () => { });

		srcStorage.eachOnLoad(src, (resolve) => resolve());

		expect(spy.calledOnce).to.be.true;
	});

	it('should execute eachOnError callback', () => {
		srcStorage.add(src);
		srcStorage.addCallbacks(src, () => { }, () => { });

		const spy = sinon.spy();

		srcStorage.eachOnError(src, spy);

		expect(spy.calledOnce).to.be.true;
	});

	it('should execute onerror callback', () => {
		const spy = sinon.spy();

		srcStorage.add(src);
		srcStorage.addCallbacks(src, () => { }, spy);

		srcStorage.eachOnError(src, (reject) => reject());

		expect(spy.calledOnce).to.be.true;
	});

	it('should delete the src of the script from the storage', () => {
		srcStorage.add(src)
		expect(srcStorage.has(src)).to.be.true;

		srcStorage.delete(src);
		expect(srcStorage.has(src)).to.be.false;
	});
});

