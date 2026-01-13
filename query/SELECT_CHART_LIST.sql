SELECT
    tmp.orddd AS "chartNo",
    tmp.ioflag AS "label",
    tmp.ORDTYPE AS "code",
    tmp.indd AS "inDate",
    tmp.dschdd AS "outDate",
    tmp.orddeptnm AS "department",
    tmp.orddrnm AS "doctor",
    tmp.pid AS "ptNo"
FROM
    (
        WITH ordhist AS(
            SELECT
                *
            FROM
                (
                    SELECT
                        otpt.ordtype,
                        CASE
                            WHEN otpt.instcd = '053'
                                AND otpt.ETCORDFLAG = '40' THEN '선별'
                            WHEN otpt.ordtype = 'S' THEN '건진'
                            ELSE '외래'
                            END ioflag,
                        '' AS indd,
                        otpt.orddd || otpt.ordtm AS ordddtm,
                        otpt.orddd AS dschdd,
                        otpt.orddrid,
                        otpt.orddeptcd,
                        otpt.pid,
                        otpt.cretno,
                        otpt.rsrvflag,
                        NVL(dept.deptengabbr, dept.deptcd) AS orddeptnm,
                        com.FN_ZS_GETUSERNM(otpt.orddrid,
                                            otpt.orddd) AS orddrnm,
                        otpt.orddd,
                        'E' AS emrflag,
                        '' jundam,
                        (
                            SELECT
                                'Y'
                            FROM
                                emr.mmrmformrec mrec
                            WHERE
                                mrec.instcd = otpt.instcd
                              AND mrec.pid = otpt.pid
                              AND mrec.orddd = otpt.orddd
                              AND mrec.cretno = otpt.cretno
                              AND mrec.formcd = '1500014099'
                              AND mrec.delyn = 'N'
                              AND rownum = 1 ) AS multiyn
                    FROM
                        pam.pmohotpt otpt,
                        com.zsdddept dept
                    WHERE
                        otpt.INSTCD = '052'
                      AND otpt.PID = :ptNo
                      AND otpt.histstat IN ('R', 'T')
                      AND otpt.ORDTYPE IN ('O', 'S')
                      AND otpt.orddd BETWEEN ADD_MONTHS(TO_CHAR(sysdate, 'YYYYMMDD'),-(12 * :term)) AND TO_CHAR(sysdate, 'YYYYMMDD')
                      AND otpt.FSTACPTDT >= (
                        SELECT
                            to_char(FSTRGSTDT, 'YYYYMMDDHH24MISS') AS fsttime
                        FROM
                            pam.pmcmptbs
                        WHERE
                            instcd = otpt.instcd
                          AND pid = otpt.pid
                          AND rownum = 1
                    )
                      AND (otpt.etcordflag NOT IN ('M', 'J', 'N', '07')
                        OR mig IS NULL)
                      AND otpt.orddeptcd = dept.deptcd
                      AND otpt.instcd = dept.instcd
                      AND otpt.orddd >= dept.valifromdd
                      AND otpt.orddd <= dept.valitodd
                      AND (EXISTS (
                        SELECT
                            1
                        FROM
                            EMR.MRIMESPI espi
                        WHERE
                            espi.instcd = otpt.instcd
                          AND espi.pid = otpt.pid
                          AND espi.orddd = otpt.orddd
                          AND espi.cretno = otpt.cretno
                          AND espi.signgenrflag IN ( 'O', 'S' )
                          AND espi.deldd = '99991231'
                          AND rownum = 1)
                        OR EXISTS (
                            SELECT
                                /*+ index(oprc IX_MMOHOPRC_T1) */
                                1
                            FROM
                                EMR.MMOHOPRC oprc
                            WHERE
                                oprc.instcd = otpt.instcd
                              AND oprc.pid = otpt.pid
                              AND oprc.prcpdd = otpt.orddd
                              AND oprc.orddeptcd = otpt.orddeptcd
                              AND oprc.prcphistcd IN ( 'O', 'D' , 'M' )
                              AND oprc.prcpauthflag IN ( '0', '1', '6' )
                              AND oprc.prcpinptflag <> '19'
                              AND oprc.prcpflag <> '3'
                              AND ( nvl(oprc.aftcertflag, '-') <> '01'
                                OR (nvl(oprc.aftcertflag, '-') = '01'
                                    AND oprc.prcpsignflag = '2'))
                              AND oprc.prcpclscd1 != 'W'
						AND rownum = 1)
                        OR EXISTS (
                            SELECT
                                1
                            FROM
                                cmr.treatt trea,
                                cmr.chartpaget chrt
                            WHERE
                                trea.instcd = otpt.instcd
                              AND trea.patid = otpt.pid
                              AND trea.indate = otpt.orddd
                              AND trea.clincode = otpt.orddeptcd
                              AND trea.class IN ('O', 'S')
                              AND trea.instcd = chrt.instcd
                              AND trea.treatno = chrt.treatno
                              AND rownum = 1)
                        )
                    UNION ALL
                    SELECT
                        inpt.ordtype,
                        CASE
                            WHEN inpt.ordtype = 'D' THEN 'SDW'
                            ELSE '입원'
                            END AS ioflag,
                        inpt.indd AS indd,
                        inpt.indd || inpt.intm AS ordddtm,
                        DECODE(inpt.dschdd, '99991231', '', inpt.dschdd) AS dschdd,
                        CASE
                            WHEN inpt.ordtype = 'E' THEN (
                                SELECT
                                    icdr.medispclid
                                FROM
                                    pam.pmihicdr icdr
                                WHERE
                                    inpt.instcd = icdr.instcd
                                  AND inpt.pid = icdr.pid
                                  AND inpt.indd = icdr.indd
                                  AND inpt.cretno = icdr.cretno
                                  AND icdr.histstat IN ('C', 'Y')
                                  AND icdr.orddeptcd = 'EM'
                                  AND ROWNUM = 1)
                            ELSE inpt.medispclid
                            END AS medispclid,
                        inpt.orddeptcd,
                        inpt.pid,
                        inpt.cretno,
                        '입원' AS rsrvflag,
                        inpt.orddeptcd AS orddeptnm,
                        CASE
                            WHEN inpt.ordtype = 'E' THEN (
                                SELECT
                                    com.FN_ZS_GETUSERNM(icdr.medispclid,
                                                        icdr.indd) usernm
                                FROM
                                    pam.pmihicdr icdr
                                WHERE
                                    inpt.instcd = icdr.instcd
                                  AND inpt.pid = icdr.pid
                                  AND inpt.indd = icdr.indd
                                  AND inpt.cretno = icdr.cretno
                                  AND icdr.histstat IN ('C', 'Y')
                                  AND icdr.orddeptcd = 'EM'
                                  AND ROWNUM = 1)
                            ELSE com.FN_ZS_GETUSERNM(inpt.medispclid,
                                                     inpt.indd)
                            END AS orddrnm,
                        inpt.indd AS orddd,
                        'E' AS emrflag,
                        '' jundam,
                        (
                            SELECT
                                'Y'
                            FROM
                                emr.mmrmformrec mrec
                            WHERE
                                mrec.instcd = INPT.instcd
                              AND mrec.pid = INPT.pid
                              AND mrec.orddd = INPT.INDD
                              AND mrec.cretno = INPT.cretno
                              AND mrec.formcd = '1500014099'
                              AND mrec.delyn = 'N'
                              AND rownum = 1 ) AS multiyn
                    FROM
                        pam.pmihinpt inpt
                    WHERE
                        inpt.instcd = '052'
                      AND inpt.pid = :ptNo
                      AND inpt.indd BETWEEN ADD_MONTHS(TO_CHAR(sysdate, 'YYYYMMDD'),-(12 * :term)) AND TO_CHAR(sysdate, 'YYYYMMDD')
                      AND inpt.histstat = 'Y'
                      AND inpt.mskind = 'M'
                      AND inpt.ordtype IN ('I', 'D')
                      AND (EXISTS (
                        SELECT
                            1
                        FROM
                            EMR.MRIMESPI espi
                        WHERE
                            espi.instcd = inpt.instcd
                          AND espi.pid = inpt.pid
                          AND espi.orddd = inpt.indd
                          AND espi.cretno = inpt.cretno
                          AND espi.signgenrflag IN ( 'I', 'D' )
                          AND espi.deldd = '99991231'
                          AND rownum = 1)
                        OR EXISTS(
                            SELECT
                                1
                            FROM
                                EMR.MMOHIPRC iprc
                            WHERE
                                iprc.instcd = inpt.instcd
                              AND iprc.pid = inpt.pid
                              AND iprc.orddd = inpt.indd
                              AND iprc.cretno = inpt.cretno
                              AND iprc.prcpdd BETWEEN inpt.indd AND inpt.dschdd
                              AND iprc.prcphistcd IN ( 'O', 'D' )
                              AND iprc.prcpauthflag IN ( '0', '1' )
                              AND iprc.prcpinptflag <> '19'
                              AND iprc.prcpflag <> '3'
                              AND iprc.prcpstatcd >= '100'
                              AND ( nvl(iprc.aftcertflag, '-') <> '01'
                                OR (nvl(iprc.aftcertflag, '-') = '01'
                                    AND iprc.prcpsignflag = '2'))
                              AND rownum = 1)
                        OR EXISTS(
                            SELECT
                                1
                            FROM
                                cmr.treatt trea,
                                cmr.chartpaget chrt
                            WHERE
                                trea.instcd = inpt.instcd
                              AND trea.patid = inpt.pid
                              AND trea.indate = inpt.indd
                              AND trea.clincode = (CASE
                                                       WHEN inpt.ordtype = 'E' THEN inpt.erorddeptcd
                                                       ELSE inpt.orddeptcd
                                END)
                              AND (trea.class IN ('I', 'D')
                                OR trea.clincode = 'EM')
                              AND trea.instcd = chrt.instcd
                              AND trea.treatno = chrt.treatno
                              AND rownum = 1)
                        )
                    UNION ALL
                    SELECT
                        a.ordtype,
                        a.ioflag,
                        a.indd,
                        a.ordddtm,
                        a.dschdd,
                        a.medispclid,
                        a.orddeptcd,
                        a.pid,
                        a.cretno,
                        a.rsrvflag,
                        a.orddeptnm,
                        a.orddrnm,
                        a.orddd,
                        a.emrflag,
                        (
                            SELECT
                                'Y'
                            FROM
                                pam.pmihicdr x,
                                (
                                    SELECT
                                        a.instcd
                                        ,
                                        a.cdnm
                                        ,
                                        a.etc1
                                        ,
                                        a.etc2
                                    FROM
                                        pam.pmcmcode a
                                    WHERE
                                        a.instcd = '052'
                                      AND a.cdgrupid = 'P1008'
                                      AND TO_CHAR(SYSDATE, 'YYYYMMDD') BETWEEN a.fromdd AND a.todd
                                ) y
                            WHERE
                                x.instcd = '052'
                              AND x.pid = a.pid
                              AND x.indd = a.indd
                              AND x.MSKIND = 'M'
                              AND x.instcd = y.instcd
                              AND x.ROOMCD = y.cdnm
                              AND x.orddeptcd = y.etc1
                              AND x.MEDISPCLID = y.etc2
                              AND rownum = 1) jundam,
                        (
                            SELECT
                                'Y'
                            FROM
                                emr.mmrmformrec mrec
                            WHERE
                                mrec.instcd = '052'
                              AND mrec.pid = a.pid
                              AND mrec.orddd = a.INDD
                              AND mrec.cretno = a.cretno
                              AND mrec.formcd = '1500014099'
                              AND mrec.delyn = 'N'
                              AND rownum = 1 ) AS multiyn
                    FROM
                        (
                            SELECT
                                'E' AS ordtype,
                                '응급' AS ioflag,
                                inpt.indd AS indd,
                                inpt.indd || inpt.intm AS ordddtm,
                                DECODE(inpt.histstat, 'X', '취소', DECODE(icdr.todd, '99991231', '', icdr.todd)) AS dschdd,
                                icdr.medispclid,
                                'EM' AS orddeptcd,
                                inpt.pid,
                                inpt.cretno,
                                '응급' AS rsrvflag,
                                (CASE
                                     WHEN orgordtype = 'E' THEN 'EM'
                                     ELSE inpt.orddeptcd
                                    END) AS orddeptnm,
                                com.FN_ZS_GETUSERNM(icdr.medispclid,
                                                    icdr.indd) AS orddrnm,
                                inpt.indd AS orddd,
                                'E' AS emrflag,
                                RANK() OVER(PARTITION BY icdr.instcd, icdr.pid, icdr.indd, icdr.cretno ORDER BY icdr.fromdd DESC, icdr.seqno DESC) AS rankicdr
                            FROM
                                pam.pmihinpt inpt,
                                pam.pmihicdr icdr
                            WHERE
                                inpt.instcd = '052'
                              AND inpt.pid = :ptNo
                              AND inpt.indd BETWEEN ADD_MONTHS(TO_CHAR(sysdate, 'YYYYMMDD'),-(12 * :term)) AND TO_CHAR(sysdate, 'YYYYMMDD')
                              AND inpt.histstat IN ('Y', 'X')
                              AND inpt.instcd = '052'
                              AND inpt.mskind = 'M'
                              AND inpt.orgordtype = 'E'
                              AND icdr.ordtype = 'E'
                              AND inpt.instcd = icdr.instcd
                              AND inpt.pid = icdr.pid
                              AND inpt.indd = icdr.indd
                              AND inpt.cretno = icdr.cretno
                              AND icdr.histstat IN ('Y', 'X', 'C')
                              AND icdr.orddeptcd = 'EM'
                              AND (EXISTS (
                                SELECT
                                    1
                                FROM
                                    EMR.MRIMESPI espi
                                WHERE
                                    espi.instcd = inpt.instcd
                                  AND espi.pid = inpt.pid
                                  AND espi.orddd = inpt.indd
                                  AND espi.cretno = inpt.cretno
                                  AND espi.signgenrflag IN ( 'I', 'E', 'D' )
                                  AND espi.deldd = '99991231'
                                  AND rownum = 1)
                                OR EXISTS(
                                    SELECT
                                        1
                                    FROM
                                        EMR.MMOHIPRC iprc
                                    WHERE
                                        iprc.instcd = inpt.instcd
                                      AND iprc.pid = inpt.pid
                                      AND iprc.orddd = inpt.indd
                                      AND iprc.cretno = inpt.cretno
                                      AND iprc.prcpdd BETWEEN inpt.indd AND inpt.dschdd
                                      AND iprc.prcphistcd IN ( 'O', 'D' )
                                      AND iprc.prcpauthflag IN ( '0', '1' )
                                      AND iprc.prcpinptflag <> '19'
                                      AND iprc.prcpflag <> '3'
                                      AND iprc.prcpstatcd >= '100'
                                      AND ( nvl(iprc.aftcertflag, '-') <> '01'
                                        OR (nvl(iprc.aftcertflag, '-') = '01'
                                            AND iprc.prcpsignflag = '2'))
                                      AND iprc.prcpgenrflag = 'E'
                                      AND rownum = 1 )
                                OR EXISTS(
                                    SELECT
                                        1
                                    FROM
                                        cmr.treatt trea,
                                        cmr.chartpaget chrt
                                    WHERE
                                        trea.instcd = inpt.instcd
                                      AND trea.patid = inpt.pid
                                      AND trea.indate = inpt.indd
                                      AND trea.clincode = 'EM'
                                      AND trea.instcd = chrt.instcd
                                      AND trea.treatno = chrt.treatno
                                      AND rownum = 1)
                                )
                        )a
                    WHERE
                        a.rankicdr = 1
                    UNION ALL
                    SELECT
                        trea.class,
                        CASE
                            WHEN trea.class = 'D' THEN 'SDW'
                            WHEN trea.class = 'I' THEN '입원'
                            WHEN trea.class = 'O' THEN '외래'
                            WHEN trea.class = 'S' THEN '건진'
                            ELSE '응급'
                            END AS ioflag,
                        CASE
                            WHEN trea.class = 'O'
                                OR trea.class = 'S' THEN ''
                            ELSE trea.indate
                            END AS indd,
                        trea.indate || '000000' AS ordddtm,
                        CASE
                            WHEN trea.class = 'O'
                                OR trea.class = 'S' THEN trea.indate
                            WHEN trea.outdate = '99991231' THEN ''
                            WHEN trea.outdate IS NULL THEN nvl((SELECT z.dschdd
                                                                FROM pam.pmihinpt z
                                                                WHERE z.instcd = '052'
                                                                  AND z.pid = trea.patid
                                                                  AND z.indd = trea.indate
                                                                  AND z.mskind = 'M'
                                                                  AND z.histstat = 'Y'
                                                                  AND z.ordtype IN ('I', 'D')
                                                                  AND rownum = 1
                                                               ), '취소')
                            ELSE trea.outdate
                            END dschdd ,
                        trea.doccode,
                        trea.clincode,
                        trea.patid,
                        trea.cmc_cretno,
                        '입원' AS rsrvflag,
                        trea.clincode AS orddeptnm,
                        com.FN_ZS_GETUSERNM(trea.doccode,
                                            trea.indate) AS orddrnm,
                        trea.indate AS orddd,
                        'I' AS emrflag,
                        '' jundam,
                        '' multiyn
                    FROM
                        cmr.treatt trea
                    WHERE
                        trea.instcd = '052'
                      AND trea.patid = :ptNo
                      AND trea.indate BETWEEN ADD_MONTHS(TO_CHAR(sysdate, 'YYYYMMDD'),-(12 * :term)) AND TO_CHAR(sysdate, 'YYYYMMDD')
                      AND trea.clincode != 'EM'
			AND trea.class <> 'E'
			AND UPPER(NVL(trea.outdate, '99991231')) != 'X'
			AND EXISTS(
			SELECT
				1
			FROM
				cmr.chartpaget aget,
				emr.mrfmform form,
				emr.mrfmsetindx indx
			WHERE
				aget.instcd = trea.instcd
				AND aget.treatno = trea.treatno
				AND form.instcd = aget.instcd
				AND form.formcd = aget.formcode
				AND form.formtodt > to_char(sysdate, 'YYYYMMDDHH24MISS')
					AND indx.instcd = form.instcd
					AND indx.linkcd = form.srcformcd
					AND rownum = 1
	                      )
                    UNION ALL
                    SELECT
                        trea.class,
                        CASE
                        WHEN trea.class = 'O'
                        OR trea.class = 'S' THEN '응급'
                        WHEN trea.class = 'I' THEN '입원'
                        WHEN trea.class = 'D' THEN 'SDW'
                        ELSE '응급'
                        END AS ioflag,
                        CASE
                        WHEN trea.class = 'O'
                        OR trea.class = 'S' THEN ''
                        ELSE trea.indate
                        END AS indd,
                        trea.indate || '000000' AS ordddtm,
                        CASE
                        WHEN trea.class = 'O'
                        OR trea.class = 'S' THEN trea.indate
                        ELSE DECODE(trea.outdate, '99991231', '', NVL(trea.outdate, ''))
                        END AS dschdd,
                        trea.doccode,
                        trea.clincode,
                        trea.patid,
                        trea.cmc_cretno,
                        '입원' AS rsrvflag,
                        trea.clincode AS orddeptnm,
                        (
                        SELECT
                        com.FN_ZS_GETUSERNM(icdr.medispclid,
                        icdr.indd)
                        FROM
                        pam.pmihicdr icdr
                        WHERE
                        icdr.instcd = '052'
                        AND icdr.pid = trea.patid
                        AND icdr.indd = trea.indate
                        AND icdr.histstat IN ('C', 'Y')
                        AND icdr.ORDDEPTCD = 'EM'
                        AND rownum = 1
                        ) AS orddrnm,
                        trea.indate AS orddd,
                        'I' AS emrflag,
                        '' jundam,
                        '' multiyn
                    FROM
                        cmr.treatt trea
                    WHERE
                        trea.instcd = '052'
                      AND trea.patid = :ptNo
                      AND trea.clincode = 'EM'
                      AND trea.indate BETWEEN ADD_MONTHS(TO_CHAR(sysdate, 'YYYYMMDD'),-(12 * :term)) AND TO_CHAR(sysdate, 'YYYYMMDD')
                      AND UPPER(NVL(trea.outdate, '99991231')) != 'X'
                      AND EXISTS(
                        SELECT
                        1
                        FROM
                        cmr.chartpaget aget,
                        emr.mrfmform form,
                        emr.mrfmsetindx indx
                        WHERE
                        aget.instcd = trea.instcd
                      AND aget.treatno = trea.treatno
                      AND form.instcd = aget.instcd
                      AND form.formcd = aget.formcode
                      AND form.formtodt > to_char(sysdate, 'YYYYMMDDHH24MISS')
                      AND indx.instcd = form.instcd
                      AND indx.linkcd = form.srcformcd
                      AND rownum = 1
                        )



                )
        )
        SELECT
            *
        FROM
            ordhist
                MINUS
            SELECT
			*
        FROM
            (
            SELECT
            t1.*
            FROM
            ordhist t1,
            (
            SELECT
            pid,
            orddd,
            ioflag,
            orddeptcd
            FROM
            ordhist
            GROUP BY
            pid,
            orddd,
            ioflag,
            orddeptcd
            HAVING
            count(1)>1) t2
            WHERE
            t1.pid = t2.pid
            AND t1.orddd = t2.orddd
            AND t1.ioflag = t2.ioflag
            AND t1.orddeptcd = t2.orddeptcd
            AND t1.emrflag = 'I'
            AND t1.ordtype IN ('O', 'S')
            UNION ALL
            SELECT
            t1.*
            FROM
            ordhist t1,
            (
            SELECT
            pid,
            orddd,
            ioflag
            FROM
            ordhist
            WHERE
            emrflag = 'E'
            ) t2
            WHERE
            t1.pid = t2.pid
            AND t1.orddd = t2.orddd
            AND t1.ioflag = t2.ioflag
            AND t1.emrflag = 'I'
            AND t1.ordtype IN ('I', 'E', 'D')
            UNION
            SELECT
            t1.*
            FROM
            ordhist t1,
            (
            SELECT
            pid,
            orddd,
            ioflag,
            orddeptcd
            FROM
            ordhist
            WHERE
            ordtype = 'E'
            AND dschdd != '취소'
            ) t2
            WHERE
            t1.pid = t2.pid
            AND t1.orddd = t2.orddd
            AND t1.ioflag = t2.ioflag
            AND t1.orddeptcd = t2.orddeptcd
            AND t1.ordtype = 'E'
            AND t1.dschdd = '취소'
            AND EXISTS (
            SELECT
            'Y'
            FROM
            ordhist t2
            WHERE
            t2.ORDTYPE = t1.ORDTYPE
            AND t2.INDD = t1.indd
            AND t2.ORDDEPTCD = t1.ORDDEPTCD
            AND t2.ordtype = 'E'
            AND t2.EMRFLAG = t1.EMRFLAG
            AND t2.DSCHDD <> '취소')
            )

    ) tmp
ORDER BY
    orddd DESC,
    ordddtm DESC,
    orddeptcd DESC
