SELECT
    tmp.pid AS "ptNo",
    tmp.hngnm AS "name",
    tmp.rrgstno1 AS "residentNo1",
    tmp.rrgstno2 AS "residentNo2",
    tmp.sex AS "sex",
    tmp.age AS "age"
FROM
    (
        SELECT
            a.pid,
            CASE
                WHEN trim(NVL(a.bindpid, '-')) <> '-' THEN 'Y'
                ELSE ''
                END AS bindyn,
            a.instcd,
            a.hngnm || CASE
                           WHEN (
                                    SELECT
                                        COUNT(*)
                                    FROM
                                        PAM.PMCMVIPM
                                    WHERE
                                        instcd = a.instcd
                                      AND rrgstno1 = a.rrgstno1
                                      AND rrgstno2 = a.rrgstno2
                                      AND histstat = 'Y'
                                      AND vipaprvyn = 'Y'
                                      AND TO_CHAR(sysdate, 'YYYYMMDD') BETWEEN fromdd AND todd ) > 0 THEN '★'
                           ELSE ''
                END AS hngnm,
            CASE
                WHEN count(a.hngnm) OVER(PARTITION BY a.hngnm, a.rrgstno1, a.rrgstno2) > 1
THEN 'Y'
                ELSE ''
                END AS dongilin,
            a.engnm,
            a.chinm,
            a.rrgstno1,
            a.rrgstno2,
            substr(a.rrgstno2, 1, 4) || '***' AS rrgstno3,
            SUBSTR(a.rrgstno2, 1, 1) || '******' AS rrgstno4,
            a.brthdd,
            a.sex,
            COM.FN_ZZ_GETAGE('000000',
                             '0000000',
                             TO_CHAR(SYSDATE, 'YYYYMMDD'),
                             'B',
                             a.brthdd) AS age,
            COM.FN_ZZ_GETAGE_EMR('000000',
                                 '0000000',
                                 TO_CHAR(SYSDATE, 'YYYYMMDD'),
                                 'B',
                                 a.brthdd) AS ageemr,
            a.bindpid,
            a.hometel,
            a.mpphontel,
            a.etctel1,
            a.etctel2,
            a.smsaprvyn,
            a.email,
            a.zipcd1,
            a.zipcd2,
            a.zipcdseq,
            a.zipcdaddr AS addr,
            a.detladdr,
            a.newaddryn,
            a.stcode,
            a.btype,
            a.rh,
            a.forgeryn,
            a.nati,
            a.psptno,
            a.recmyn,
            a.recmerid,
            (
                SELECT
                    DISTINCT b.usernm
                FROM
                    com.zsumusrb b
                WHERE
                    b.userid = a.recmerid
                  AND b.userfromdd <= TO_CHAR(SYSDATE, 'YYYYMMDD')
                  AND b.usertodd >= TO_CHAR(SYSDATE, 'YYYYMMDD')
            ) AS recmernm,
            a.recmerrela,
            a.vipyn,
            (
                SELECT
                    (
                        SELECT
                            cdnm
                        FROM
                            com.zbcmcode
                        WHERE
                            cdgrupid = 'P0443'
                          AND cdid = vipcls
                          AND to_char(sysdate, 'YYYYMMDD') BETWEEN VALIFROMDD AND VALITODD)
                        || '  ' ||
                    (
                        SELECT
                            cdnm
                        FROM
                            pam.pmcmcode
                        WHERE
                            cdgrupid = 'P0443'
                          AND cdid = vipflag
                          AND instcd = a.instcd
                          AND to_char(sysdate, 'YYYYMMDD') BETWEEN fromdd AND todd)
                FROM
                    PAM.PMCMVIPM
                WHERE
                    instcd = a.instcd
                  AND rrgstno1 = a.rrgstno1
                  AND rrgstno2 = a.rrgstno2
                  AND histstat = 'Y'
                  AND vipaprvyn = 'Y'
                  AND TO_CHAR(sysdate, 'YYYYMMDD') BETWEEN fromdd AND todd
                  AND rownum = 1
            )AS viprem,
            a.religncd,
            a.baptnm,
            a.chchnm,
            a.dethyn,
            a.dethdt,
            SUBSTR(a.dethdt, 1, 8) AS dethdd,
            SUBSTR(a.dethdt, 9, 6) AS dethtm,
            a.chosresn,
            a.animyn,
            a.exptresncd,
            a.handicapryn,
            a.pidflag,
            a.remfact,
            a.ptunyn,
            a.fstrgstrid,
            to_CHAR(a.fstrgstdt) AS fstrgstdt,
            a.lastupdtrid,
            to_CHAR(a.lastupdtdt) AS lastupdtdt,
            GREATEST(( SELECT NVL(MAX(inpt.indd), '00000000')
                       FROM pam.pmihinpt inpt
                       WHERE inpt.instcd = a.instcd
                         AND inpt.pid = a.pid
                         AND inpt.histstat = 'Y'
                         AND inpt.mskind = 'M' )
                ,( SELECT NVL (MAX(otpt.orddd), '00000000')
                   FROM pam.pmohotpt otpt
                   WHERE otpt.instcd = a.instcd
                     AND otpt.pid = a.pid
                     AND otpt.histstat = 'R'
                     AND otpt.dracptyn = 'Y')
            ) AS lastorddd
            ,
            (
                SELECT
                    max(orddeptcd) keep(DENSE_RANK LAST
		ORDER BY
			orddd,
			dracptdt)
                FROM
                    pam.pmohotpt mohotpt
                WHERE
                    mohotpt.pid = a.pid
                  AND mohotpt.instcd = '052'
                  AND mohotpt.histstat = 'R'
                  AND mohotpt.dracptyn = 'Y'
            ) lastorddeptcd
            ,
            (
                SELECT
                    /*+ use_nl(mohotpt dept ) */
                    max(dept.depthngnm) keep(DENSE_RANK LAST
		ORDER BY
			orddd,
			dracptdt)
                FROM
                    pam.pmohotpt mohotpt,
                    com.zsdddept dept
                WHERE
                    mohotpt.pid = a.pid
                  AND mohotpt.instcd = '052'
                  AND mohotpt.histstat = 'R'
                  AND mohotpt.dracptyn = 'Y'
                  AND mohotpt.orddeptcd = dept.deptcd(+)
            ) lastorddeptnm
            ,
            (
                SELECT
                    (
                        SELECT
                            cdnm
                        FROM
                            com.zbcmcode
                        WHERE
                            cdgrupid = 'P0008'
                          AND cdid = i.insukind
                          AND valifromdd <= TO_CHAR(SYSDATE, 'YYYYMMDD')
                          AND valitodd >= TO_CHAR(SYSDATE, 'YYYYMMDD')
                          AND ROWNUM = 1)
                FROM
                    pam.pmohotpt i
                WHERE
                    i.pid = a.pid
                  AND i.instcd = '052'
                  AND i.histstat = 'R'
                  AND i.dracptyn = 'Y'
                  AND rownum = 1
            ) lastinsukind_old
            ,
            (
                SELECT
                    max(zc.cdnm) keep(DENSE_RANK LAST
		ORDER BY
			i.orddd,
			i.dracptdt)
                FROM
                    pam.pmohotpt i,
                    com.zbcmcode zc
                WHERE
                    i.pid = a.pid
                  AND i.instcd = '052'
                  AND i.histstat = 'R'
                  AND i.dracptyn = 'Y'
                  AND zc.cdgrupid = 'P0008'
                  AND zc.cdid = i.insukind
                  AND zc.valifromdd <= TO_CHAR(SYSDATE, 'YYYYMMDD')
                  AND zc.valitodd >= TO_CHAR(SYSDATE, 'YYYYMMDD')
            ) lastinsukind
            ,
            (
                SELECT
                    substr(cdnm, 0, 2)
                FROM
                    com.zbcmcode code
                WHERE
                    code.cdgrupid = 'P0609'
                  AND cdid = (
                    SELECT
                        patflag
                    FROM
                        pam.pmcmptsp
                    WHERE
                        pid = a.pid
                      AND instcd = a.instcd
                      AND rownum = 1)
                  AND CDID != '40'
    )AS patspcfyn,
    CASE
    WHEN (
			SELECT
				COUNT(pid)
			FROM
				pam.pmchcapm
			WHERE
				pid = a.pid
				AND instcd = '052' ) > 0 THEN 'Y'
			ELSE 'N'
END AS capmyn,
		CASE
			WHEN EXISTS (
			SELECT
				1
			FROM
				pam.pmihinpt inpt
			WHERE
				inpt.instcd = a.instcd
				AND inpt.pid = a.pid
				AND inpt.histstat = 'Y'
				AND inpt.mskind = 'M'
				AND inpt.dschdd = '99991231'
				AND inpt.indschacptstat = 'A'
				AND inpt.calcdd != '00000000'
) THEN 'Y'
			ELSE 'N'
END AS inhospyn,
		COALESCE ( (
		SELECT
			brateflag
		FROM
			PAM.PMIHINPT
		WHERE
			pid = a.pid
			AND instcd = a.instcd
			AND histstat = 'Y'
			AND ordtype IN ('E', 'I')
				AND brateflag = 'I'
				AND dschdd = TO_CHAR(SYSDATE, 'YYYYMMDD')
					AND indschacptstat = 'D'
					AND rownum = 1 )
,
		'N') AS tdaydsch

,
		a.kioskrcptnoyn AS kioskrcptnoyn
,
		a.kioskrcptnocd AS kioskrcptnocd
,
		a.carnum AS carnum
,
		a.mig AS mig
,
		PAM.FN_GET_SCANE_YN(a.instcd,
		a.pid) AS scanyn
,
		PAM.FN_GET_SPIFSCANYN(a.instcd,
		a.pid) AS spifscanyn
,
		a.smsinfoyn
,
		a.happycallyn
,
		a.essenyn
,
		a.choiyn
,
		CASE
			b.faithyn WHEN 'N' THEN '일반'
			WHEN 'Y' THEN '여호와의증인'
			ELSE '해당없음'
END AS ntnsflag
,
		NVL(b.faithyn, '-') AS faithyn
,
		b.seqno AS blsseq
,
		NVL(b.fromdd, to_char(sysdate, 'YYYYMMDD') ) AS fromdd
,
		a.bankcd
,
		a.onlnno
,
		a.deponm
,
		a.longshortdb
,
		(
		SELECT
			substr(fromdd, 0, 4) || '-' || substr(fromdd, 5, 2) || '-' || substr(fromdd, 7, 2) || ' ~ ' || substr(todd, 0, 4) || '-' || substr(todd, 5, 2) || '-' || substr(todd, 7, 2) AS fromtodd
		FROM
			pam.pmcmbhsm
		WHERE
			1 = 1
			AND instcd = a.instcd
			AND histstat = 'Y'
			AND pid = a.pid
			AND to_char(sysdate, 'YYYYMMDD') BETWEEN fromdd AND todd
				AND fromdd = (
				SELECT
					min(fromdd)
				FROM
					pam.pmcmbhsm c
				WHERE
					a.instcd = c.instcd
					AND a.pid = c.pid
					AND c.histstat = 'Y'
					AND to_char(sysdate, 'YYYYMMDD') BETWEEN c.fromdd AND c.todd)
					AND rownum = 1) AS bhsmdd
,
		(
		SELECT
			bohunflag
		FROM
			pam.pmcmbhsm
		WHERE
			1 = 1
			AND instcd = a.instcd
			AND histstat = 'Y'
			AND pid = a.pid
			AND to_char(sysdate, 'YYYYMMDD') BETWEEN fromdd AND todd
				AND fromdd = (
				SELECT
					min(fromdd)
				FROM
					pam.pmcmbhsm c
				WHERE
					a.instcd = c.instcd
					AND a.pid = c.pid
					AND c.histstat = 'Y'
					AND to_char(sysdate, 'YYYYMMDD') BETWEEN c.fromdd AND c.todd)
					AND rownum = 1) AS bohuncd
,
		staddrremfact
,
		a.mlpyn
	FROM
		(
		SELECT
			*
		FROM
			PAM.PMCMPTBS ptbs
		WHERE
			ptbs.pid = :ptNo
			AND ptbs.instcd = '052'
) a ,
		(
		SELECT
			*
		FROM
			pam.pmcmntns ntns
		WHERE
			ntns.instcd = '052'
			AND ntns.pid = :ptNo
			AND ntns.histstat = 'Y'
			AND ntns.seqno = (
			SELECT
				MAX(seqno)
			FROM
				pam.pmcmntns ntns2
			WHERE
				ntns2.instcd = ntns.instcd
				AND ntns2.pid = ntns.pid
				AND ntns2.histstat = 'Y'
				AND to_char(sysdate, 'YYYYMMDD') BETWEEN ntns2.fromdd AND ntns2.todd
)
				AND to_char(sysdate, 'YYYYMMDD') BETWEEN ntns.fromdd AND ntns.todd
					AND rownum = 1
)b
	WHERE
		a.instcd = b.instcd(+)
		AND a.pid = b.pid(+)
) tmp
WHERE
	rownum <= 50
